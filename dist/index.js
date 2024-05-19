"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
const client_1 = require("@prisma/client");
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (_, res) => {
    res.json({ message: "Server is healthy" });
});
app.post("/api/v1/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const details = req.body;
    try {
        yield client.companyDetails.create({
            data: {
                userId: details.userId,
                name: details.name,
                details: details.details,
                testimonials: details.testimonials,
                previous_projects: details.previous_projects,
                executive_summary: details.executive_summary,
                pricing_sector: details.pricing_sector,
                objectives: details.objectives,
                problems: details.problems,
                solutions: details.solutions,
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    updateDb(details);
    res.status(200).json({ message: "ok" });
}));
function updateDb(details) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < proposalTemplates.length; i++) {
            console.log(details);
            const proposal = (yield generate(JSON.stringify(details), i)) || [];
            const generatedProposal = yield client.proposal.create({
                data: {
                    title: i.toString(),
                    content: proposal[0].message.content,
                    userId: details.userId,
                },
            });
        }
    });
}
const generate = (prompt, templateIdx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You’re an experienced business consultant who excels in crafting compelling and persuasive proposals for a wide range of clients across different industries. Your specialty lies in tailoring each proposal to showcase unique selling points, addressing client needs effectively, and presenting a clear roadmap for success.
              Your task is to draft a business proposal using the following template and details provided. These are the details of the company ${prompt} and here is the template ${proposalTemplates[templateIdx]}`,
                },
            ],
            model: "gpt-3.5-turbo",
        });
        return completion.choices;
    }
    catch (e) {
        console.log(e);
        return;
    }
});
const proposalTemplates = [
    `Business Proposal
      [Your Company Name]
      [Your Company Tagline]
      [Your Address]
      [City, State, Zip Code]
      [Email Address]
      [Phone Number]
      [Website URL]
      1. Executive Summary
      [Your Company Name] is pleased to submit this proposal to [Client's Company Name]. We are confident that our team’s expertise and dedication will help you achieve your business goals effectively and efficiently.
      
      2. Company Overview
      Company Name: [Your Company Name]
      Founded: [Year]
      Industry: [Industry]
      Services Offered: [Brief description of your services]
      
      3. Objectives
      Objective 1: [Specific, measurable goal]
      Objective 2: [Specific, measurable goal]
      Objective 3: [Specific, measurable goal]
      4. Solutions
      We offer the following solutions to address your needs:
      
      Solution 1: [Description of the solution]
      Solution 2: [Description of the solution]
      Solution 3: [Description of the solution]
      5. Project Plan and Timeline
      Phase 1: Planning
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 2: Development
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 3: Implementation
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      6. Pricing
      We offer the following pricing packages:
      
      Basic Package
      Description: [Details of what is included]
      Price: [$Amount]
      Premium Package
      Description: [Details of what is included]
      Price: [$Amount]
      Enterprise Package
      Description: [Details of what is included]
      Price: [$Amount]
      7. Previous Projects
      Project 1:
      
      Title: [Project Title]
      Description: [Brief description of the project]
      Outcome: [Results achieved]
      Year: [Year]
      Project 2:
      
      Title: [Project Title]
      Description: [Brief description of the project]
      Outcome: [Results achieved]
      Year: [Year]
      8. Testimonials
      John Doe, CEO of Example Corp:
      "Tech Innovators Inc. provided exceptional service and delivered our project on time and within budget. Their team is highly professional and skilled."
      
      Jane Smith, CTO of Sample Co:
      "We are extremely satisfied with the solutions provided by Tech Innovators Inc. Their innovative approach helped us achieve our business goals efficiently."
      
      9. Conclusion
      We look forward to the opportunity to work with [Client's Company Name] and to help you achieve your business objectives. Please do not hesitate to contact us if you have any questions or need further information.
      
      Thank you for considering [Your Company Name].
      
      10. Contact Information
      Contact Person: [Your Name]
      Title: [Your Title]
      Email: [Your Email]
      Phone: [Your Phone Number]
      
      Appendix
      Company Brochure: [Attach any additional documents]
      `,
    `Business Proposal
      [Your Company Name]
      [Your Company Tagline]
      [Your Address]
      [City, State, Zip Code]
      [Email Address]
      [Phone Number]
      [Website URL]
      1. Cover Letter
      Dear [Client’s Name],
      
      We are excited to present our proposal for [Project/Service Name] for [Client’s Company Name]. At [Your Company Name], we believe in delivering top-quality services that align with your business goals and objectives. Enclosed in this proposal is a comprehensive plan tailored to meet your needs.
      
      Thank you for considering [Your Company Name].
      
      Sincerely,
      
      [Your Name]
      [Your Title]
      
      2. Table of Contents
      Cover Letter
      Project Overview
      Company Background
      Team Introduction
      Project Plan and Timeline
      Deliverables
      Pricing
      Benefits
      Previous Projects
      Testimonials
      Terms and Conditions
      Conclusion
      Contact Information
      3. Project Overview
      Project Title: [Project Title]
      Client: [Client’s Company Name]
      Prepared By: [Your Company Name]
      Objective:
      [Brief description of the project’s main goal and why it is important to the client.]
      
      Scope of Work:
      
      Task 1: [Description]
      Task 2: [Description]
      Task 3: [Description]
      4. Company Background
      Company Name: [Your Company Name]
      Established: [Year]
      Industry: [Industry]
      Mission: [Your Company Mission Statement]
      
      Overview:
      [Brief history and background of your company, including key achievements and expertise relevant to the proposal.]
      
      5. Team Introduction
      Project Manager: [Name]
      Role: [Project Manager's Role]
      Experience: [Brief description of experience]
      
      Team Member 1: [Name]
      Role: [Role]
      Experience: [Brief description of experience]
      
      Team Member 2: [Name]
      Role: [Role]
      Experience: [Brief description of experience]
      
      6. Project Plan and Timeline
      Phase 1: Discovery
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 2: Development
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 3: Delivery
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      7. Deliverables
      Deliverable 1: [Description of the deliverable]
      Deliverable 2: [Description of the deliverable]
      Deliverable 3: [Description of the deliverable]
      
      8. Pricing
      Basic Package
      Description: [Details of what is included]
      Price: [$Amount]
      Premium Package
      Description: [Details of what is included]
      Price: [$Amount]
      Enterprise Package
      Description: [Details of what is included]
      Price: [$Amount]
      9. Benefits
      Benefit 1: [Description of the benefit]
      Benefit 2: [Description of the benefit]
      Benefit 3: [Description of the benefit]
      10. Previous Projects
      Project 1:
      
      Title: [Project Title]
      Description: [Brief description of the project]
      Outcome: [Results achieved]
      Year: [Year]
      Project 2:
      
      Title: [Project Title]
      Description: [Brief description of the project]
      Outcome: [Results achieved]
      Year: [Year]
      11. Testimonials
      John Doe, CEO of Example Corp:
      "Tech Innovators Inc. provided exceptional service and delivered our project on time and within budget. Their team is highly professional and skilled."
      
      Jane Smith, CTO of Sample Co:
      "We are extremely satisfied with the solutions provided by Tech Innovators Inc. Their innovative approach helped us achieve our business goals efficiently."
      
      12. Terms and Conditions
      Payment Terms: [Description of payment terms]
      Project Timeline: [Description of project timeline]
      Confidentiality: [Description of confidentiality terms]
      Other Terms: [Any other relevant terms]
      13. Conclusion
      We are confident that [Your Company Name] can deliver the results you are looking for. We look forward to working with [Client’s Company Name] and achieving great success together. Please contact us with any questions or to discuss the proposal further.
      
      14. Contact Information
      Contact Person: [Your Name]
      Title: [Your Title]
      Email: [Your Email]
      Phone: [Your Phone Number]`,
    `Business Proposal
      [Your Company Name]
      [Your Company Tagline]
      [Your Address]
      [City, State, Zip Code]
      [Email Address]
      [Phone Number]
      [Website URL]
      1. Introduction
      Dear [Client’s Name],
      
      Thank you for the opportunity to present this proposal. At [Your Company Name], we are committed to delivering top-notch solutions tailored to your business needs. We look forward to working with [Client’s Company Name] and achieving great success together.
      
      Sincerely,
      
      [Your Name]
      [Your Title]
      
      2. Project Overview
      Client: [Client’s Company Name]
      Project Title: [Project Title]
      Date: [Date]
      
      Objective:
      [State the primary objective of the project and why it’s important to the client.]
      
      3. Problem Statement
      Problem 1: [Describe the first problem the client is facing.]
      Problem 2: [Describe the second problem the client is facing.]
      Problem 3: [Describe the third problem the client is facing.]
      
      4. Proposed Solutions
      Solution 1: [Describe how your solution addresses Problem 1.]
      Solution 2: [Describe how your solution addresses Problem 2.]
      Solution 3: [Describe how your solution addresses Problem 3.]
      
      5. Project Plan
      Phase 1: Research & Analysis
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 2: Development
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 3: Implementation
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      Phase 4: Review & Support
      Task 1: [Description]
      Task 2: [Description]
      Timeline: [Dates]
      6. Deliverables
      Deliverable 1: [Description]
      Deliverable 2: [Description]
      Deliverable 3: [Description]
      7. Pricing
      Basic Package:
      
      Description: [Details]
      Price: [$Amount]
      Standard Package:
      
      Description: [Details]
      Price: [$Amount]
      Premium Package:
      
      Description: [Details]
      Price: [$Amount]
      8. Benefits to Client
      Benefit 1: [Description of the benefit to the client]
      Benefit 2: [Description of the benefit to the client]
      Benefit 3: [Description of the benefit to the client]
      9. Company Experience
      Project 1:
      
      Title: [Project Title]
      Client: [Client Name]
      Description: [Brief description]
      Outcome: [Results achieved]
      Project 2:
      
      Title: [Project Title]
      Client: [Client Name]
      Description: [Brief description]
      Outcome: [Results achieved]
      10. Client Testimonials
      John Doe, CEO of Example Corp:
      "Tech Innovators Inc. provided exceptional service and delivered our project on time and within budget. Their team is highly professional and skilled."
      
      Jane Smith, CTO of Sample Co:
      "We are extremely satisfied with the solutions provided by Tech Innovators Inc. Their innovative approach helped us achieve our business goals efficiently."
      
      11. Terms and Conditions
      Payment Terms: [Description]
      Project Timeline: [Description]
      Confidentiality: [Description]
      Other Terms: [Description]
      12. Conclusion
      We are excited about the possibility of working with [Client’s Company Name]. Our team is ready to deliver solutions that drive success and growth for your business. Please feel free to contact us with any questions or to discuss this proposal further.
      
      Thank you for your consideration.
      
      13. Contact Information
      Contact Person: [Your Name]
      Title: [Your Title]
      Email: [Your Email]
      Phone: [Your Phone Number]`,
];
app.listen(3000, () => console.log("Server started on port 3000"));
