import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginComponent from "./components/auth/loginComponent";
import HomePage from "./components/HomePage";
import TeachersList from "./components/TeachersList";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./app/store";
import { ReactNode, useEffect } from "react";
import AddTeacherForm from "./components/forms/teachers/AddTeacherForm";
import ParentsList from "./components/ParentsList";
import AddParentForm from "./components/forms/parents/addParentForm";
import StudentsList from "./components/StudentsList";
import AddStudentForm from "./components/forms/students/AddStudentForm";
import SubjectsLists from "./components/SubjectsList";
import AddSubjectForm from "./components/forms/subjects/AddSubjectForm";
import AssignSubjectForm from "./components/forms/subjects/AssignSubjectForm";
import LoggedTeacherSubjects from "./components/forms/LoggedTeacherSubjects";
import QueryStudent from "./components/forms/students/QueryStudent";
import SetYearTerm from "./components/forms/exams/SetYearTerm";
import ExamRanks from "./components/forms/students/ExamRanks";
import StudentsProgress from "./components/forms/students/StudentsProgress";
import ProgressData from "./components/forms/students/ProgressData";
import MyPaySlips from "./components/forms/teachers/MyPaySlips";
import PayslipCard from "./components/forms/teachers/PaySlipCard";
import PayRoll from "./components/finance/PayRoll";
import NewPayroll from "./components/finance/forms/NewPayroll";
import FeesPayable from "./components/finance/forms/FeesPayable";
import ReceiptFees from "./components/finance/forms/ReceiptFees";
import WalletBalances from "./components/finance/forms/WalletBalances";
import FeePaidList from "./components/finance/forms/FeePaidList";
import Ledger from "./components/finance/forms/Ledger";
import Revenue from "./components/finance/forms/Revenue";
import FeeBalances from "./components/finance/forms/FeeBalances";
import Expenditure from "./components/finance/forms/Expenditure";
import AllReports from "./components/forms/students/AllReports";
import Report from "./components/forms/students/Report";
import Weeks from "./components/forms/students/Weeks";
import MyReports from "./components/forms/teachers/MyReports";
import ComposeAReport from "./components/forms/teachers/ComposeAReport";
import MyReportDetails from "./components/forms/teachers/MyReportDetails";
import NewSchoolFee from "./components/finance/forms/NewSchoolFee";
import KidProgress from "./components/forms/parents/KidProgress";
import KidProgressData from "./components/forms/parents/KidProgressData";
import MyKidsFees from "./components/forms/parents/MyKidsFees";
import FeeStatements from "./components/forms/parents/FeeStatements";
import KidReports from "./components/forms/parents/MyKidReports";
import KidReportDetails from "./components/forms/parents/KidReportDetails";
import UpdatesComponent from "./components/commons/UpdatesComponent";
import { login } from "./features/authSlice";
import ComposeNofication from "./components/commons/ComposeNofication";
import ChangeUserPassword from "./components/commons/ChangeUserPassword";
import PasswordReset from "./components/auth/PasswordReset";
import RequestPasswordReset from "./components/./auth/RequestPasswordReset";
import LevelList from "./components/LevelsList";
import NewLevel from "./components/forms/levels/NewLevel";
import LedgerInsights from "./components/finance/forms/LedgerInsights";
import PayableBills from "./components/finance/forms/PayableBills";
import BilledList from "./components/finance/forms/BilledList";
import BillStudentForm from "./components/finance/forms/BillStudentForm";
import BillPaymentList from "./components/finance/forms/BillPaymentList";
import NewBillForm from "./components/finance/forms/NewBillForm";

interface props {
  children?: ReactNode;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const userDetails = localStorage.getItem("userDetails");
    if (token && userDetails) {
      // Parse the user details from JSON
      const parsedUserDetails = JSON.parse(userDetails);
      // Dispatch the login action with the user details
      dispatch(login(parsedUserDetails));
    }
  }, [dispatch]);

  const HeadTeacherRoute = ({ children }: props) => {
    const userDetails = localStorage.getItem("userDetails");
    const user = userDetails ? JSON.parse(userDetails) : null;

    if (!user || user.type !== "headTeacher") {
      return <Navigate to="/" />;
    }

    return children;
  };

  const CommonRoute = ({ children }: props) => {
    const userDetails = localStorage.getItem("userDetails");
    const user = userDetails ? JSON.parse(userDetails) : null;
    if (
      !user ||
      (user.type !== "headTeacher" &&
        user.type !== "accountant" &&
        user.type !== "teacher" &&
        user.type !== "parent")
    ) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const AllExceptParent = ({ children }: props) => {
    const userDetails = localStorage.getItem("userDetails");
    const user = userDetails ? JSON.parse(userDetails) : null;
    if (
      !user ||
      (user.type !== "headTeacher" &&
        user.type !== "accountant" &&
        user.type !== "teacher")
    ) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const ParentRoute = ({ children }: props) => {
    const userDetails = localStorage.getItem("userDetails");
    const user = userDetails ? JSON.parse(userDetails) : null;

    if (!user || user.type !== "parent") {
      return <Navigate to="/" />;
    }

    return children;
  };
  const TeacherRoute = ({ children }: props) => {
    const userDetails = localStorage.getItem("userDetails");
    const user = userDetails ? JSON.parse(userDetails) : null;
    if (!user || user.type !== "teacher") {
      return <Navigate to="/" />;
    }
    return children;
  };

  const FinanceRoute = ({ children }: props) => {
    const userDetails = localStorage.getItem("userDetails");
    const user = userDetails ? JSON.parse(userDetails) : null;
    if (!user || user.type !== "accountant") {
      return <Navigate to="/" />;
    }

    return children;
  };

  const NotFound = () => {
    return (
      <div>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
      </div>
    );
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/home"
            element={
              <CommonRoute>
                <HomePage />
              </CommonRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <HeadTeacherRoute>
                <TeachersList />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/new/teacher"
            element={
              <HeadTeacherRoute>
                <AddTeacherForm />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/parents"
            element={
              <HeadTeacherRoute>
                <ParentsList />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/new/parent"
            element={
              <HeadTeacherRoute>
                <AddParentForm />
              </HeadTeacherRoute>
            }
          />

          <Route
            path="/students"
            element={
              <HeadTeacherRoute>
                <StudentsList />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/new/student"
            element={
              <HeadTeacherRoute>
                <AddStudentForm />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <HeadTeacherRoute>
                <SubjectsLists />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/new/subject"
            element={
              <HeadTeacherRoute>
                <AddSubjectForm />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/assign-subjects/:id"
            element={
              <HeadTeacherRoute>
                <AssignSubjectForm />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/my-subjects/"
            element={
              <TeacherRoute>
                <LoggedTeacherSubjects />
              </TeacherRoute>
            }
          />
          <Route
            path="/students-data/"
            element={
              <TeacherRoute>
                <QueryStudent />
              </TeacherRoute>
            }
          />
          <Route
            path="/year-exam/"
            element={
              <TeacherRoute>
                <SetYearTerm />
              </TeacherRoute>
            }
          />
          <Route
            path="/exam-ranks/"
            element={
              <TeacherRoute>
                <ExamRanks />
              </TeacherRoute>
            }
          />
          <Route
            path="/students-progress/"
            element={
              <TeacherRoute>
                <StudentsProgress />
              </TeacherRoute>
            }
          />
          <Route
            path="/progress-data/"
            element={
              <TeacherRoute>
                <ProgressData />
              </TeacherRoute>
            }
          />
          <Route
            path="/my-payslips/"
            element={
              <TeacherRoute>
                <MyPaySlips />
              </TeacherRoute>
            }
          />
          <Route
            path="/payslip-details/:id"
            element={
              <TeacherRoute>
                <PayslipCard />
              </TeacherRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <FinanceRoute>
                <PayRoll />
              </FinanceRoute>
            }
          />
          <Route
            path="/new-payslip"
            element={
              <FinanceRoute>
                <NewPayroll />
              </FinanceRoute>
            }
          />
          <Route
            path="/school-fees"
            element={
              <FinanceRoute>
                <FeesPayable />
              </FinanceRoute>
            }
          />
          <Route
            path="/receipt-fee/:year/:term/:grade/:fee"
            element={
              <FinanceRoute>
                <ReceiptFees />
              </FinanceRoute>
            }
          />
          <Route
            path="/received-fee/:year/:term/:grade/:fee"
            element={
              <FinanceRoute>
                <FeePaidList />
              </FinanceRoute>
            }
          />
          <Route
            path="/wallet-balances"
            element={
              <FinanceRoute>
                <WalletBalances />
              </FinanceRoute>
            }
          />
          <Route
            path="/ledger"
            element={
              <FinanceRoute>
                <Ledger />
              </FinanceRoute>
            }
          />
          <Route
            path="/new/revenue"
            element={
              <FinanceRoute>
                <Revenue />
              </FinanceRoute>
            }
          />
          <Route
            path="/new/expenditure"
            element={
              <FinanceRoute>
                <Expenditure />
              </FinanceRoute>
            }
          />
          <Route
            path="/fee-balances/:year/"
            element={
              <FinanceRoute>
                <FeeBalances />
              </FinanceRoute>
            }
          />
          <Route
            path="/weekly-reports"
            element={
              <HeadTeacherRoute>
                <AllReports />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/report/kid/progress/:id/"
            element={
              <HeadTeacherRoute>
                <Report />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/report/weeks/"
            element={
              <HeadTeacherRoute>
                <Weeks />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <TeacherRoute>
                <MyReports />
              </TeacherRoute>
            }
          />
          <Route
            path="/report/compose/"
            element={
              <TeacherRoute>
                <ComposeAReport />
              </TeacherRoute>
            }
          />
          <Route
            path="/report/my/kid/progress/:id/"
            element={
              <TeacherRoute>
                <MyReportDetails />
              </TeacherRoute>
            }
          />
          <Route
            path="/new/school/fee"
            element={
              <FinanceRoute>
                <NewSchoolFee />
              </FinanceRoute>
            }
          />

          <Route
            path="/my/kid/progress"
            element={
              <ParentRoute>
                <KidProgress />
              </ParentRoute>
            }
          />

          <Route
            path="/my/kid/progress-data"
            element={
              <ParentRoute>
                <KidProgressData />
              </ParentRoute>
            }
          />
          <Route
            path="/tuition/fee/"
            element={
              <ParentRoute>
                <MyKidsFees />
              </ParentRoute>
            }
          />
          <Route
            path="/fee-statements/:year/:term/:fee/:grade"
            element={
              <ParentRoute>
                <FeeStatements />
              </ParentRoute>
            }
          />

          <Route
            path="/my/kid/reports"
            element={
              <ParentRoute>
                <KidReports />
              </ParentRoute>
            }
          />
          <Route
            path="/report/my/kid/progress/report/:id/"
            element={
              <ParentRoute>
                <KidReportDetails />
              </ParentRoute>
            }
          />
          <Route
            path="/all/my/updates"
            element={
              <CommonRoute>
                <UpdatesComponent />
              </CommonRoute>
            }
          />
          <Route
            path="/compose/notification"
            element={
              <AllExceptParent>
                <ComposeNofication />
              </AllExceptParent>
            }
          />
          <Route
            path="/change/password"
            element={
              <CommonRoute>
                <ChangeUserPassword />
              </CommonRoute>
            }
          />
          <Route
            path="/levels"
            element={
              <HeadTeacherRoute>
                <LevelList />
              </HeadTeacherRoute>
            }
          />

          <Route
            path="/new/level"
            element={
              <HeadTeacherRoute>
                <NewLevel />
              </HeadTeacherRoute>
            }
          />
          <Route
            path="/more/insights/:from/:to/"
            element={
              <FinanceRoute>
                <LedgerInsights />
              </FinanceRoute>
            }
          />
          <Route
            path="/more/insights/"
            element={
              <FinanceRoute>
                <LedgerInsights />
              </FinanceRoute>
            }
          />
          <Route
            path="/billing/"
            element={
              <FinanceRoute>
                <PayableBills />
              </FinanceRoute>
            }
          />
          <Route
            path="/billed/:billId/"
            element={
              <FinanceRoute>
                <BilledList />
              </FinanceRoute>
            }
          />
          <Route
            path="/bill/students/:billId"
            element={
              <FinanceRoute>
                <BillStudentForm />
              </FinanceRoute>
            }
          />
          <Route
            path="/billing/payment-list/:billId"
            element={
              <FinanceRoute>
                <BillPaymentList />
              </FinanceRoute>
            }
          />
          <Route
            path="/billing/new/"
            element={
              <FinanceRoute>
                <NewBillForm />
              </FinanceRoute>
            }
          />
          <Route path="/reset-password/confirm" element={<PasswordReset />} />
          <Route path="/request/reset" element={<RequestPasswordReset />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
