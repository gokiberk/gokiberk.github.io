import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";

export default function Writing() {
  return (
    <div className="flex h-screen">
      {/* Sidebar with collapsible functionality */}
      <SideMenu />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <PageTitle title="Writing" className="lg hidden" />

          {/* Full Card Section */}
          <div className="bg-gradient-to-b from-green-900 via-black-700 to-green-500 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            {/* Title Section */}
            <h1 className="text-3xl font-extrabold">
              Still thinking what to write...
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
}