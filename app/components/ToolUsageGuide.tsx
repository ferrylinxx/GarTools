import Link from 'next/link';

interface ToolUsageGuideProps {
  toolName: string;
}

export default function ToolUsageGuide({ toolName }: ToolUsageGuideProps) {
  return (
    <section className="mt-10 bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-3xl font-black text-gray-900 mb-4">
        How to Use {toolName} Effectively
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        {toolName} is designed to help you process media quickly while keeping quality under control.
        Start by uploading a clean source file and choosing settings based on your target platform.
        For social media, prioritize smaller output size and faster load times. For archival or client
        delivery, use higher quality settings and verify playback before sharing the final file.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        A practical workflow is simple: upload, choose output options, process, then preview your result.
        If you are working in batches, keep your format and naming rules consistent so files stay organized.
        For better reliability, test one sample file first, then run the full batch once you are happy with
        the output. This reduces rework and saves time when handling larger projects.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        Common use cases include preparing video for web upload, converting audio for podcast platforms,
        optimizing files for messaging apps, and creating lightweight media for landing pages. If needed,
        combine tools in sequence, for example convert first, then compress, to maintain better quality.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Privacy note: uploaded files are processed to generate your result and are not stored permanently
        by default. Temporary retention may apply for operational reliability, and minimal technical logs
        may be collected for security and debugging. See our{' '}
        <Link href="/privacy" className="font-bold text-blue-600 hover:underline">
          Privacy Policy
        </Link>{' '}
        for full details.
      </p>
    </section>
  );
}
