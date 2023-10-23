import React from "react";

const AttentionFooter = () => {
  return (
    <>
      <p className="text-muted-foreground font-bold text-xs md:text-lsm text-center py-4 px-16 bottom-0">
        <span className="text-red-400">Important Notice:</span> While this tool
        aims to assist and provide information, it is crucial to recognize its
        limitations. This AI tool does not replace the expertise and
        personalized care offered by human professionals, particularly in
        critical areas such as mental health (psychology) or life-threatening
        situations (e.g., electrical issues). For assistance in these specific
        domains, we strongly recommend reaching out to a qualified human
        professional. The site and its AI responses do not assume responsibility
        for outcomes or consequences. Your well-being and safety are paramount,
        so consulting with a real person in these specialized fields is highly
        encouraged. For urgent mental health support, contact a licensed
        psychologist, and in life-threatening situations, seek assistance from a
        qualified electrician or emergency services. For immediate first aid
        mental health support, you can reach ARAN [ער״ן- עזרה ראשונה נפשית] at
        number 1201. <br />
        <span className="text-emerald-400">
          Thank you for understanding and prioritizing your well-being.
        </span>
      </p>
    </>
  );
};

export default AttentionFooter;
