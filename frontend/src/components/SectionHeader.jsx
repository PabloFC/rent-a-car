function SectionHeader({ tag, title, subtitle }) {
  return (
    <div className="text-center mb-14">
      <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-2">
        {tag}
      </p>
      <h2 className="text-4xl font-bold text-white font-serif">{title}</h2>
      {subtitle && (
        <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
