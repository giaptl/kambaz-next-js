import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/courses/2000" className="wd-dashboard-course-link">
            <Image src="/images/database.jpeg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS2000 Database Design </h5>
              <p className="wd-dashboard-course-title">
                Relational and Non-relational Schemas
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/courses/3000" className="wd-dashboard-course-link">
            <Image src="/images/systems.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS3000 Systems Programming </h5>
              <p className="wd-dashboard-course-title">
                Low-level programming, memory management, and operating system concepts.
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/courses/4000" className="wd-dashboard-course-link">
            <Image src="/images/swe.jpeg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS4000 Software Engineering </h5>
              <p className="wd-dashboard-course-title">
                Team-based development, version control, testing, and design patterns.
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/courses/5000" className="wd-dashboard-course-link">
            <Image src="/images/networks.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS5000 Computer Networks </h5>
              <p className="wd-dashboard-course-title">
                Network architectures, protocols, and distributed communication.
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/courses/6000" className="wd-dashboard-course-link">
            <Image src="/images/ai.jpeg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS6000 Artificial Intelligence </h5>
              <p className="wd-dashboard-course-title">
                Search, basic machine learning, and intelligent decision-making.
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
        <Link href="/courses/7000" className="wd-dashboard-course-link">
            <Image src="/images/webdev.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5> CS7000 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Front-end and back-end development, APIs, and deployment basics.
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}

