### Server Architecture Flowchart (Mermaid)

```mermaid
flowchart TD
  %% Entry
  A[server/server.js] --> B[connect DB]\nconfig/db.js
  A --> C[connect Cloudinary]\nconfig/cloudinary.js
  A --> D[Init Sentry]\nconfig/instrument.js
  A --> E[Express Middlewares]\nCORS, JSON, clerkMiddleware

  %% Routes mounting
  A --> R1[/POST /webhooks/]
  A --> R2[//api/company/*/]
  A --> R3[//api/jobs/*/]
  A --> R4[//api/users/*/]

  %% Webhooks
  subgraph Webhooks
    direction TB
    R1 --> W1[controllers/webhooks.clerkWebhooks]
    W1 -->|user.created| M3[(models/User)]
    W1 -->|user.updated| M3
    W1 -->|user.deleted| M3
  end

  %% Company domain
  subgraph Company API
    direction TB
    R2 --> CR1[POST /register\n+ upload.single('image')]
    R2 --> CR2[POST /login]
    R2 --> CR3[GET /company\n+ protectCompany]
    R2 --> CR4[POST /post-job\n+ protectCompany]
    R2 --> CR5[GET /applicants\n+ protectCompany]
    R2 --> CR6[GET /list-jobs\n+ protectCompany]
    R2 --> CR7[POST /change-status\n+ protectCompany]
    R2 --> CR8[POST /change-visibility\n+ protectCompany]

    CR1 --> CC1[controllers/companyController.registerCompany]
    CC1 --> U1[utils/generateToken]
    CC1 --> M1[(models/Company)]
    CC1 --> CL1[Cloudinary Upload]

    CR2 --> CC2[controllers/companyController.loginCompany]
    CC2 --> M1
    CC2 --> U1

    CR3 --> CC3[controllers/companyController.getCompanyData]
    CC3 --> M1

    CR4 --> CC4[controllers/companyController.postJob]
    CC4 --> M2[(models/Job)]

    CR5 --> CC5[controllers/companyController.getCompanyJobApplicants]
    CC5 --> M4[(models/JobApplication)]

    CR6 --> CC6[controllers/companyController.getCompanyPostedJobs]
    CC6 --> M2

    CR7 --> CC7[controllers/companyController.changeJobApplicationsStatus]
    CC7 --> M4

    CR8 --> CC8[controllers/companyController.changeVisiblity]
    CC8 --> M2
  end

  %% Jobs domain
  subgraph Jobs API
    direction TB
    R3 --> JR1[GET /]
    R3 --> JR2[GET /:id]

    JR1 --> JC1[controllers/jobController.getJobs]
    JC1 --> M2
    JC1 --> M1

    JR2 --> JC2[controllers/jobController.getJobById]
    JC2 --> M2
    JC2 --> M1
  end

  %% Users domain
  subgraph Users API
    direction TB
    R4 --> UR1[GET /user]
    R4 --> UR2[POST /apply]
    R4 --> UR3[GET /applications]
    R4 --> UR4[POST /update-resume\n+ upload.single('resume')]

    UR1 --> UC1[controllers/userController.getUserData]
    UC1 --> M3

    UR2 --> UC2[controllers/userController.applyForJob]
    UC2 --> M4
    UC2 --> M2

    UR3 --> UC3[controllers/userController.getUserJobApplications]
    UC3 --> M4

    UR4 --> UC4[controllers/userController.updateUserResume]
    UC4 --> M3
  end

  %% Middleware and config
  subgraph Auth & Middleware
    direction TB
    MW1[protectCompany\nmiddlewares/authMiddleware.js] -->|verify JWT| U1
    MW1 --> M1
  end

  subgraph Config & Utils
    direction TB
    CFG1[config/db.js]
    CFG2[config/cloudinary.js]
    CFG3[config/multer.js]
    U1[utils/generateToken.js]
  end

  %% Relations
  E -->|clerkMiddleware provides req.auth| Users API
  CFG3 -. used by .-> Company API
  CFG3 -. used by .-> Users API
  D -. Sentry error handler .-> A

  %% Models
  subgraph Models
    direction TB
    M1[(Company)]
    M2[(Job)]
    M3[(User)]
    M4[(JobApplication)]
  end

  %% Data relations (Mongo refs)
  M2 --- M1
  M4 --- M3
  M4 --- M1
  M4 --- M2
```

### Notes

- Clerk middleware populates `req.auth.userId` for user controllers and is applied globally in `server.js`.
- `protectCompany` reads `req.headers.token`, verifies JWT, and sets `req.company`.
- File uploads use Multer disk storage; images go to Cloudinary in `registerCompany`.
- Sentry is initialized once and its error handler is attached after routes.
