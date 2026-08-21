import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout } from '@components';
import { IconGitHub, IconLinkedin, IconExternal } from '@components/icons';

const StyledResumeContainer = styled.main`
  color: var(--text-secondary);

  header {
    margin-bottom: 50px;

    h1 {
      margin: 0 0 8px;
      font-size: var(--fz-heading);
      color: var(--text);
      line-height: 1.2;
    }

    .subtitle {
      margin: 0 0 16px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }

    .contact-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      a {
        ${({ theme }) => theme.mixins.inlineLink};
        display: inline-flex;
        align-items: center;
        color: var(--text);

        svg {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }
    }
  }

  section {
    margin: 0 0 40px;
    padding: 0;
    max-width: none;

    h2 {
      margin: 0 0 16px;
      padding-bottom: 8px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--line);
    }
  }

  .experience-item,
  .project-item {
    margin-bottom: 20px;

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;

      h3 {
        color: var(--text);
        font-size: var(--fz-md);
        font-weight: 600;
        margin: 0;
      }

      .date {
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        white-space: nowrap;
        margin-left: 16px;
      }

      a {
        ${({ theme }) => theme.mixins.inlineLink};
        display: inline-flex;
        align-items: center;
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--text-muted);
        white-space: nowrap;
        margin-left: 16px;
      }
    }

    .sub-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;

      .position {
        color: var(--text-secondary);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
      }

      .location,
      .date {
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
      }

      a {
        ${({ theme }) => theme.mixins.inlineLink};
        display: inline-flex;
        align-items: center;
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        color: var(--text-muted);
      }
    }

    .header-row a svg,
    .sub-row a svg {
      width: 13px;
      height: 13px;
      margin-right: 4px;
    }

    p {
      font-size: var(--fz-sm);
    }

    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: var(--fz-sm);

      li {
        position: relative;
        padding-left: 16px;
        margin-bottom: 4px;
        &:before {
          content: '–';
          position: absolute;
          left: 0;
          color: var(--text-muted);
        }
      }
    }
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;

    .skill-category {
      h4 {
        color: var(--text);
        margin: 0 0 6px;
        font-size: var(--fz-sm);
        font-weight: 600;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;

        li {
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: var(--fz-xs);
          margin: 0;

          &:not(:last-child):after {
            content: '·';
            margin: 0 6px;
            color: var(--text-muted);
          }
        }
      }
    }
  }

  table.impact-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;

    th,
    td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid var(--line);
      font-size: var(--fz-sm);
    }

    th:first-child,
    td:first-child {
      padding-left: 0;
    }

    th:last-child,
    td:last-child {
      padding-right: 0;
    }

    th {
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    td {
      color: var(--text-secondary);
      vertical-align: top;
    }

    @media (max-width: 900px) {
      display: block;
      overflow-x: auto;
    }
  }
`;

const ResumeButton = styled.a`
  ${({ theme }) => theme.mixins.button};
  margin-top: 20px;
  display: inline-block;
`;

const ResumePage = ({ location }) => (
  <Layout location={location}>
    <StyledResumeContainer>
      <header>
        <h1>Shaurya Tiwari</h1>
        <div className="subtitle">AI Software Engineer · Physical AI · OpenUSD · Simulation</div>
        <div className="contact-links">
          <a href="mailto:vaasutiwari@gmail.com">vaasutiwari@gmail.com</a>
          <a href="tel:+18503454646">+1 (850) 345-4646</a>
          <a href="https://linkedin.com/in/shauryatiwari" target="_blank" rel="noreferrer">
            <IconLinkedin /> LinkedIn
          </a>
          <a href="https://github.com/Shazam6565" target="_blank" rel="noreferrer">
            <IconGitHub /> GitHub
          </a>
          <a href="https://shauryatiwari.com" target="_blank" rel="noreferrer">
            <IconExternal /> Website
          </a>
        </div>
        <ResumeButton href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Download / View Resume
        </ResumeButton>
      </header>

      <section>
        <h2>Summary</h2>
        <p>
          AI Software Engineer specializing in production-grade agentic systems and data retrieval
          platforms working as a forward deployed engineer for 9+ verticals at U.S. News & World
          Report. Expertise in Django backends, LangChain/LangGraph orchestration, vector store
          usage (OpenSearch/FAISS), and streaming APIs. Proven ability to ship reliable AI
          integrated products with industry grade guardrail infrastructure support (legal
          compliance), from site search to B2B data analysis agentic tool with real time graph and
          csv generations, performing in ambiguous environments with strong cross-functional
          collaboration across multiple verticals.
        </p>
        <p>
          NVIDIA-Certified in OpenUSD, with hands-on Isaac Sim, Isaac Lab, robot policy training,
          and simulation workflows for Physical AI.
        </p>
      </section>

      <section>
        <h2>Physical AI &amp; Simulation</h2>

        <div className="project-item">
          <div className="header-row">
            <h3>NVIDIA-Certified Professional: OpenUSD Development</h3>
            <span className="date">July 2026</span>
          </div>
          <div className="sub-row">
            <a
              href="https://www.credly.com/badges/74c2ccf3-c904-453b-98db-ef9c6d1caec8"
              target="_blank"
              rel="noreferrer"
            >
              Verify on Credly
            </a>
          </div>
        </div>

        <div className="project-item">
          <div className="header-row">
            <h3>Force-Aware Peg Insertion</h3>
          </div>
          <div className="sub-row">
            <span className="position">Isaac Lab, Isaac Sim, PPO, PhysX</span>
            <a
              href="https://github.com/Shazam6565/Policy-RL-Peg_insertion"
              target="_blank"
              rel="noreferrer"
            >
              <IconGitHub /> GitHub
            </a>
          </div>
          <ul>
            <li>
              Benchmarked four PPO policy variants across three seeds to evaluate whether force
              feedback improves Franka peg-insertion robustness under nominal and randomized
              conditions.
            </li>
            <li>
              Designed controlled reward/observation ablations with TensorBoard-logged metrics
              against a reproduced geometry-only baseline.
            </li>
          </ul>
        </div>

        <div className="project-item">
          <div className="header-row">
            <h3>GPU-Parallel Robot Policy Training</h3>
          </div>
          <div className="sub-row">
            <span className="position">Isaac Lab, Isaac Sim, PhysX, ovphysx, Python</span>
            <a
              href="https://github.com/Shazam6565/Policy-RL-Peg_insertion"
              target="_blank"
              rel="noreferrer"
            >
              <IconGitHub /> GitHub
            </a>
          </div>
          <ul>
            <li>
              Built GPU-parallel reinforcement-learning workflows in Isaac Lab, running large-scale
              PhysX simulations for robot policy training.
            </li>
            <li>
              Configured vectorized environments, observations, actions, rewards, and domain
              randomization for high-throughput policy training and evaluation.
            </li>
          </ul>
        </div>

        <div className="project-item">
          <div className="header-row">
            <h3>Digital-Twin &amp; Robotics Asset Pipeline</h3>
          </div>
          <div className="sub-row">
            <span className="position">Omniverse, OpenUSD, ovrtx, ovphysx, Isaac Sim</span>
            <a
              href="https://github.com/Shazam6565/isaac-sim-workspace"
              target="_blank"
              rel="noreferrer"
            >
              <IconGitHub /> GitHub
            </a>
          </div>
          <ul>
            <li>
              Assembled and optimized SimReady OpenUSD digital twins and robotics assets using
              composition, instancing, materials, URDF interoperability, validation, and
              scene-optimization workflows.
            </li>
            <li>
              Structured USD environments for modular ovrtx rendering/sensor simulation and ovphysx
              physics workflows across NVIDIA Physical AI applications.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Experience</h2>

        <div className="experience-item">
          <div className="header-row">
            <h3>U.S. News & World Report</h3>
            <span className="date">Aug 2024 – Present</span>
          </div>
          <div className="sub-row">
            <span className="position">AI Software Engineer</span>
            <span className="location">New York</span>
          </div>
          <ul>
            <li>
              Architected ByteSage Django backend driving AI products with LangGraph agent workflows
            </li>
            <li>
              Implement RAG pipelines using OpenSearch/FAISS for semantic retrieval with metadata
              filtering
            </li>
            <li>
              Deploy streaming endpoints; harden reliability across dev/sandbox/UAT/prod
              environments
            </li>
            <li>
              Build guardrails and conditional routing for production-safe agentic tool execution
            </li>
            <li>
              Partnered with stakeholders across 12 business verticals to convert ambiguous domain
              problems into validated AI roadmaps, implementation plans, and production-ready
              engineering scopes
            </li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="header-row">
            <h3>COAPS, Florida State University</h3>
            <span className="date">May 2023 – May 2024</span>
          </div>
          <div className="sub-row">
            <span className="position">Software Engineer</span>
            <span className="location">Florida</span>
          </div>
          <ul>
            <li>
              Built Python/Airflow pipelines processing 1M+ marine data points into PostgreSQL (10+
              TB)
            </li>
            <li>
              Developed Django REST APIs serving 2M+ users/researchers with the marine data
              acquisition dashboards
            </li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="header-row">
            <h3>Florida State University</h3>
            <span className="date">Aug 2022 – Apr 2023</span>
          </div>
          <div className="sub-row">
            <span className="position">Graduate Research Assistant</span>
            <span className="location">Florida</span>
          </div>
          <ul>
            <li>
              Engineered PyTorch/TensorFlow models achieving 0.92 F1-score for anomaly detection
            </li>
            <li>
              Reduced inference time 40% via custom CUDA kernels; boosted throughput 30% with GPU
              clustering
            </li>
            <li>
              Built and trained deep learning models in PyTorch, including GAN-based experiments and
              reinforcement learning concepts for synthetic climate-state data generation
            </li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="header-row">
            <h3>ACS Pvt. Ltd</h3>
            <span className="date">Jan 2021 – Dec 2021</span>
          </div>
          <div className="sub-row">
            <span className="position">DevOps Engineer</span>
            <span className="location">Mumbai</span>
          </div>
          <ul>
            <li>
              Maintained CI/CD pipelines (Jenkins, Docker, SonarQube); cut MTTR 80% with AWS
              CloudWatch
            </li>
            <li>
              Automated infrastructure provisioning with Terraform, reducing deployment time by 60%
            </li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="header-row">
            <h3>Cart Geek</h3>
            <span className="date">Jun 2020 – Dec 2020</span>
          </div>
          <div className="sub-row">
            <span className="position">Web Development Intern</span>
            <span className="location">Mumbai</span>
          </div>
          <ul>
            <li>
              It was here where I was introduced to multiple CMS systems like Wordpress, Drupal,
              Magento, and Shopify.
            </li>
            <li>
              Implemented multiple extension based solutions for client sites supporting increase in
              traffic and clicks.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Selected Projects</h2>
        <div className="project-item">
          <div className="header-row">
            <h3>Cerebral Valley Agent Hackathon - Agent IDE Mind Map (Nov 2025)</h3>
          </div>
          <p>
            Using Antigravity IDE’s reasoning logs to generate mind map for tracking the development
            process with AI agents.
          </p>
        </div>
        <div className="project-item">
          <div className="header-row">
            <h3>Portfolio AI Chatbot (May 2024)</h3>
          </div>
          <p>
            RAG assistant with Llama 3, Chroma vector DB, LangChain for conversational resume
            queries.
          </p>
        </div>
        <div className="project-item">
          <div className="header-row">
            <h3>Transformer from Scratch (Feb–Apr 2024)</h3>
          </div>
          <p>
            Built text completion model implementing self-attention; tracked perplexity dynamics.
          </p>
        </div>
        <div className="project-item">
          <div className="header-row">
            <h3>Medical Image Segmentation (Aug–Dec 2023)</h3>
          </div>
          <p>Polyp detection model (PyTorch/OpenCV) achieving 0.92 DSC, 0.86 JC.</p>
        </div>
        <div className="project-item">
          <div className="header-row">
            <h3>AutoTicket: Internal Company Hackathon (March 2026)</h3>
          </div>
          <p>
            Built an automatic Jira/Confluence/GitLab-integrated triaging system on ByteSage&apos;s
            agent orchestration, generating tickets and boilerplate code from intake forms and
            saving up to 3 weeks of project initiation time.
          </p>
        </div>
        <div className="project-item">
          <div className="header-row">
            <h3>POView: Cerebral Valley Hackathon (March 2026)</h3>
          </div>
          <p>
            Built a 3D geospatial globe interface with the Google Places API and Gemini Live API,
            letting users navigate to referenced locations through conversational AI.
          </p>
        </div>
        <div className="project-item">
          <div className="header-row">
            <h3>InstruX (Feb 2026 – Present)</h3>
            <a href="https://instrux.world/" target="_blank" rel="noreferrer">
              <IconExternal /> instrux.world
            </a>
          </div>
          <p>
            Open source project. Designed a reference architecture for an agentic
            robotics-evaluation layer connecting simulation, synthetic scenario generation, and
            policy-readiness assessment.
          </p>
        </div>
      </section>

      <section>
        <h2>NVIDIA Applied Work</h2>

        <div className="experience-item">
          <div className="header-row">
            <h3>Technical Communication</h3>
          </div>
          <ul>
            <li>
              100+ livestreams hosted on OpenUSD, Isaac Sim, Isaac Lab, and Physical AI concepts,
              all logged on YouTube Live with code, notes, and references
            </li>
          </ul>
        </div>

        <div className="experience-item">
          <div className="header-row">
            <h3>SIGGRAPH 2026: NVIDIA Physical AI Hands-On Labs</h3>
          </div>
          <ul>
            <li>
              Blender, Oranges, and ovrtx: integrated ovrtx, ovphysx, and ovstage with Blender to
              build an RTX-rendered, physics-enabled OpenUSD workflow using composable NVIDIA
              Omniverse Libraries
            </li>
            <li>
              Ray Trace Your Way With Omniverse Libraries: built an OpenUSD-based RTX viewport with
              Omniverse Libraries, loading and querying USD scenes, rendering RTX output,
              controlling cameras, and generating image results
            </li>
            <li>
              Advancing World Simulation With 3D Gaussian Splatting: built a real-world-to-
              simulation reconstruction workflow using NVIDIA fVDB and Omniverse NuRec, applying
              multi-GPU 3D Gaussian Splatting, segmentation, and object-level integration to create
              simulation-ready environments for Isaac Sim / Isaac Lab
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Skills</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h4>Languages</h4>
            <ul>
              <li>Python</li>
              <li>C/C++ (CUDA)</li>
              <li>Java</li>
              <li>JavaScript/TypeScript</li>
              <li>SQL</li>
            </ul>
          </div>
          <div className="skill-category">
            <h4>AI/ML</h4>
            <ul>
              <li>LangChain</li>
              <li>LangGraph</li>
              <li>PyTorch</li>
              <li>TensorFlow</li>
              <li>RAG</li>
              <li>Vector Store</li>
              <li>PPO</li>
            </ul>
          </div>
          <div className="skill-category">
            <h4>Data/Infra</h4>
            <ul>
              <li>Django</li>
              <li>PostgreSQL</li>
              <li>Airflow</li>
              <li>OpenSearch</li>
              <li>Docker</li>
              <li>AWS</li>
            </ul>
          </div>
          <div className="skill-category">
            <h4>Tools/Observability</h4>
            <ul>
              <li>Git</li>
              <li>Jenkins</li>
              <li>New Relic</li>
              <li>Snyk</li>
              <li>CloudWatch</li>
            </ul>
          </div>
          <div className="skill-category">
            <h4>Physical AI / Simulation</h4>
            <ul>
              <li>OpenUSD</li>
              <li>Isaac Sim</li>
              <li>Isaac Lab</li>
              <li>PhysX</li>
              <li>ovrtx</li>
              <li>ovphysx</li>
              <li>ovstage</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Education</h2>
        <div className="experience-item">
          <div className="header-row">
            <h3>Florida State University</h3>
            <span className="date">May 2024</span>
          </div>
          <div className="sub-row">
            <span className="position">M.S. Computer Science</span>
            <span className="date">GPA: 3.8/4.0</span>
          </div>
        </div>
        <div className="experience-item">
          <div className="header-row">
            <h3>NMIMS University</h3>
            <span className="date">Aug 2022</span>
          </div>
          <div className="sub-row">
            <span className="position">B.Tech Information Technology</span>
            <span className="date">GPA: 3.3/4.0</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Impact Snapshot</h2>
        <table className="impact-table">
          <thead>
            <tr>
              <th>Project / Impact</th>
              <th>Tech Stack</th>
              <th>Company & Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Production AI workflows with tool orchestration and guardrails</td>
              <td>Django, LangChain, LangGraph, DRF APIs</td>
              <td>U.S. News (Present)</td>
            </tr>
            <tr>
              <td>
                Improved system observability and reduced mean time to detect and report outages
              </td>
              <td>New Relic, Slackbots, ByteSage</td>
              <td>U.S. News (Present)</td>
            </tr>
            <tr>
              <td>Real-time analytics platform serving 200k+ users across 125 schools</td>
              <td>Python, Airflow, PostgreSQL, Django REST, React</td>
              <td>COAPS (2023–2024)</td>
            </tr>
            <tr>
              <td>High-performance anomaly detection (40% speedup)</td>
              <td>PyTorch, TensorFlow, CUDA kernels</td>
              <td>FSU (2022–2023)</td>
            </tr>
            <tr>
              <td>Automated CI/CD smoketests reducing deployment risk 80%</td>
              <td>Jenkins, Docker, AWS EC2/S3, CloudWatch</td>
              <td>ACS (2021)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </StyledResumeContainer>
  </Layout>
);

ResumePage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ResumePage;
