import { SideMenu } from "@/components/SideMenu";
import { PageTitle } from "@/components/PageTitle";
import Img from 'next/image';

export default function Gallery() {
  return (
    <div className="flex h-screen">
      {/* Sidebar with collapsible functionality */}
      <SideMenu />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <PageTitle title="Gallery" className="lg hidden" />

          {/* Full Card Section */}
          <div className="bg-gradient-to-b from-white-900 via-black-700 to-white-500 text-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
            {/* Title Section */}
            <h1 className="text-3xl font-extrabold text-black text-center mb-6">
              Waiting for my lab to develop some photos...
            </h1>
            <div className="flex justify-center m-4">
              <Img
                src="/gallery/engagement.jpg"
                alt="Photography"
                width={800}
                height={1200}
                className="animate-reveal"
                nopin="nopin"
              />
            </div>
            <div className="flex justify-center m-4">
              <Img
                src="/gallery/erdemesiee.jpg"
                alt="Photography"
                width={800}
                height={1200}
                className="animate-reveal"
                nopin="nopin"
              />
            </div>
            <div className="flex justify-center m-4">
              <Img
                src="/gallery/balat.jpg"
                alt="Photography"
                width={800}
                height={1200}
                className="animate-reveal"
                nopin="nopin"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
