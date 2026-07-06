/**
 * Article registry for service pages.
 * Each entry corresponds to a slug in `src/data/content.ts` `services` array.
 * T3 (tech-writer) fills in the content; this file provides the data shape
 * and empty stubs so the route renders without crashing.
 */

export interface ArticleSection {
  heading: string;
  body: string; // plain text paragraphs separated by \n\n
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface ServiceArticle {
  slug: string;
  title: string;
  metaDescription: string;
  ogImage?: string;
  sections: ArticleSection[];
  faqs: ArticleFAQ[];
  relatedSlugs: string[];
}

export const articles: Record<string, ServiceArticle> = {
  'general-family-dentistry': {
    slug: 'general-family-dentistry',
    title: 'General & Family Dentistry',
    metaDescription:
      'Gentle routine dental care for all ages in Dumaguete City — check-ups, cleanings, fillings, and preventive treatment in a calm, welcoming environment.',
    sections: [
      {
        heading: 'What Is General and Family Dentistry?',
        body:
          'General and family dentistry covers the everyday services that keep your teeth, gums, and mouth healthy throughout every stage of life. It includes routine dental exams, professional cleanings, cavity detection, fillings, and preventive treatments like fluoride applications and dental sealants. The goal is to catch small problems before they become serious and to help you maintain a healthy, comfortable smile for years to come.\n\nDuring a typical visit, your dentist will examine your teeth and gums, remove plaque and tartar buildup, and discuss any concerns you may have. X-rays may be taken periodically to check for issues that are not visible to the naked eye, such as decay between teeth or early bone loss. Your visit also includes personalized advice on brushing technique, flossing, and dietary choices that support your oral health at home. If treatment is needed, your dentist will walk you through the options and explain each step clearly before proceeding.\n\nPreventive care is a cornerstone of general dentistry. Regular visits allow your dentist to monitor changes in your oral health over time, creating a record that makes it easier to spot emerging problems early — when they are simpler and less expensive to treat. This ongoing relationship is one of the most valuable aspects of having a dental home you can trust.',
      },
      {
        heading: 'Who Is General and Family Dentistry For?',
        body:
          'Everyone. General and family dentistry is designed for patients of all ages, from the moment a child gets their first tooth through adulthood and into the senior years. If you are looking for a dental home where your whole family can receive consistent, trusted care from a team that knows your history, this is the right place.\n\nYou may seek general dentistry if you want to stay on top of routine check-ups, if you have a specific concern such as tooth sensitivity, bleeding gums, or persistent bad breath, or if it has been more than six months since your last visit. It is also the right starting point when you need a referral to a specialist for more complex treatment, because your general dentist coordinates your overall oral health care and can recommend the most appropriate next steps.\n\nEven if you have no specific complaints, a regular check-up can catch issues you are not yet aware of. Many dental problems develop silently, without pain, until they reach an advanced stage. Seeing your dentist regularly is one of the most effective forms of self-care you can practice for your oral health.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'When you visit Lerio Dental Center for general dentistry, you will find a team that takes time to know you as a person, not just a set of teeth. The clinic is located on Dr. V. Locsin Street in Dumaguete City, a comfortable, easy-to-find location with a warm staff that welcomes questions at every appointment.\n\nThe team uses modern diagnostic equipment and follows strict autoclave sterilization protocols for every instrument, so safety is never a concern. Your exam is thorough but never rushed. If you have dental anxiety, let the staff know — they are experienced in making visits as comfortable as possible. Cleanings are gentle, and any treatment recommendations are explained in plain language so you understand exactly what is happening, why it matters, and what the alternatives are before you decide.\n\nThe clinic also takes time to educate. Rather than simply telling you what to do, the team explains why certain habits or treatments matter for your specific situation. This approach helps patients feel genuinely informed rather than simply complying with instructions they do not fully understand.',
      },
      {
        heading: 'Why Patients Choose Us in Dumaguete City',
        body:
          'Lerio Dental Center has been serving the Dumaguete City and Negros Oriental community for years, building lasting relationships with families who return generation after generation because they trust the team is judgment and care. One of the things patients appreciate most is transparency: treatment options, costs, and timelines are discussed upfront before any work begins, so there are no surprises.\n\nThe clinic offers comprehensive services under one roof, so whether your child needs a filling, you need a cleaning, or your parent needs a denture adjustment, you can receive coordinated care without being referred elsewhere. This continuity makes it easier to track your dental history over time and provide the most appropriate care at every age and stage of life.\n\nThe convenience of a central Dumaguete City location means patients from across Negros Oriental can access quality dental care without traveling to more distant urban centers. For families balancing busy schedules, having a reliable dental home nearby makes it much easier to keep up with regular visits.',
      },
    ],
    faqs: [
      {
        question: 'How often should I visit for a general dental check-up?',
        answer:
          'Most patients benefit from a check-up and cleaning every six months. Your dentist may recommend more frequent visits depending on your individual oral health needs, such as a history of gum disease or high cavity risk.',
      },
      {
        question: 'Is general dentistry painful?',
        answer:
          'Routine procedures like cleanings and fillings are typically comfortable. The team uses gentle techniques and can discuss comfort measures with you before any treatment to help you feel at ease throughout your visit.',
      },
      {
        question: 'How much does a dental check-up cost in the Philippines?',
        answer:
          'Costs vary depending on the services provided during your visit. Lerio Dental Center discusses transparent pricing with you before treatment begins, so there are no surprises to worry about.',
      },
      {
        question: 'Do I need a referral to see a general dentist?',
        answer:
          'No referral is needed. You can book an appointment directly by calling or messaging the clinic, and the staff will find a convenient time that fits your schedule.',
      },
    ],
    relatedSlugs: ['pediatric-dentistry', 'geriatric-dentistry', 'cosmetic-esthetic-dentistry'],
  },

  'cosmetic-esthetic-dentistry': {
    slug: 'cosmetic-esthetic-dentistry',
    title: 'Cosmetic & Esthetic Dentistry',
    metaDescription:
      'Whitening, veneers, and esthetic restorations in Dumaguete City — cosmetic dentistry that enhances your natural smile with a gentle, personalized approach.',
    sections: [
      {
        heading: 'What Is Cosmetic and Esthetic Dentistry?',
        body:
          'Cosmetic and esthetic dentistry focuses on improving the appearance of your teeth and smile. While general dentistry prioritizes oral health, cosmetic dentistry blends health and beauty — addressing concerns such as tooth discoloration, chips, gaps, uneven spacing, and misshapen teeth. Common treatments include professional teeth whitening, porcelain veneers, esthetic composite fillings, and gum contouring.\n\nA cosmetic consultation begins with understanding what you want to change about your smile and why. Your dentist then recommends the most appropriate options based on your goals, the current condition of your teeth, and your overall oral health. Some treatments can be completed in a single visit; others are part of a planned series over weeks or months. The dentist will give you a realistic picture of what each option can and cannot achieve before you commit to anything.\n\nCosmetic dentistry is not just about vanity. When you feel good about your smile, it can affect how you speak in public, how you eat, and how you present yourself socially. The connection between oral appearance and self-confidence is well-documented, and helping patients feel comfortable sharing their smile is a meaningful part of what the team does.',
      },
      {
        heading: 'Who Is Cosmetic Dentistry For?',
        body:
          'Cosmetic dentistry is for anyone who feels self-conscious about their smile and wants to make a change. You do not need to have a serious dental problem — many patients seek cosmetic treatment for gradual changes that have affected their confidence over time, such as teeth that have darkened with age, a chip from an old filling, or a gap they have always wanted to close.\n\nIt is also for patients who want to combine esthetic improvements with restorative work. For example, if you need a crown or bridge, esthetic dentistry ensures the result looks natural and blends seamlessly with your surrounding teeth. The right candidate is someone in good general oral health whose primary concern is cosmetic rather than urgent medical — though any underlying disease or decay will be addressed before cosmetic treatment begins.\n\nThere is no minimum or maximum age for cosmetic dentistry. Teenagers who have completed orthodontic treatment may seek esthetic refinement, while many older adults pursue treatments that reverse years of wear and discoloration. What matters most is that your teeth and gums are healthy enough to support the planned procedures.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'At Lerio Dental Center, cosmetic treatment starts with a conversation. The team takes time to understand what you like and dislike about your current smile, what you hope to achieve, and what fits your lifestyle and budget. There is no one-size-fits-all approach — each treatment plan is tailored to the individual after a thorough examination.\n\nThe clinic uses modern materials and techniques for predictable esthetic outcomes. Whether you are considering professional whitening or a more involved restoration such as veneers, the team explains every step so you feel confident and informed. Comfort is a priority throughout every procedure. If a particular treatment is not well-suited to your teeth, the team will explain why and suggest a more appropriate alternative.\n\nBefore any cosmetic work begins, the dentist will show you what results you can realistically expect. This might include photographs, models, or digital imaging, so you are never proceeding based on guesswork. Managing expectations honestly is a value the team takes seriously — a good result is one that looks natural and functions well, not one that simply looks different.',
      },
      {
        heading: 'Why Patients Choose Us in Dumaguete City',
        body:
          'Patients in Dumaguete City and across Negros Oriental choose Lerio Dental Center for cosmetic dentistry because the team takes a conservative, honest approach. Rather than recommending the most expensive option, they suggest what will actually work for your teeth and goals. If a treatment is not right for you, they will say so clearly and explain the alternatives.\n\nThe clinic is conveniently located on Dr. V. Locsin Street, making it accessible for local residents and patients traveling from surrounding areas. The focus on transparent communication means you will always know what to expect before any work begins — including realistic outcomes, treatment timelines, and costs. This honest approach has built the trust that keeps patients returning for all their dental needs.\n\nBecause the clinic offers a full range of dental services, cosmetic patients can also address any underlying issues — such as cavities or gum health — in the same place, without needing to start over with a new provider. This integrated approach is more convenient and produces better long-term results.',
      },
    ],
    faqs: [
      {
        question: 'How much does cosmetic dentistry cost in the Philippines?',
        answer:
          'Costs depend on the type and extent of treatment. Your dentist will provide a clear cost estimate during your consultation so you can make an informed decision about your care.',
      },
      {
        question: 'Is professional teeth whitening safe?',
        answer:
          'Yes, professional teeth whitening performed by a qualified dentist is safe when done correctly. The team will evaluate your teeth and gums to ensure whitening is appropriate for you before proceeding.',
      },
      {
        question: 'How long does cosmetic dental treatment take?',
        answer:
          'Some treatments, like professional whitening, can be completed in one visit. Others, such as veneers or esthetic restorations, may require multiple appointments over several weeks to achieve the best result.',
      },
      {
        question: 'Do I need cavities treated before cosmetic work?',
        answer:
          'Generally, yes. Your dentist will examine your oral health and address any underlying decay or gum disease before beginning cosmetic treatment to ensure the best and most lasting result.',
      },
    ],
    relatedSlugs: ['general-family-dentistry', 'prosthodontics'],
  },

  'pediatric-dentistry': {
    slug: 'pediatric-dentistry',
    title: 'Pediatric Dentistry',
    metaDescription:
      'Gentle, kid-friendly dental care in Dumaguete City — pediatric dentistry that helps children build healthy habits and feel safe from their very first visit.',
    sections: [
      {
        heading: 'What Is Pediatric Dentistry?',
        body:
          'Pediatric dentistry is a specialized branch of dental care focused on the oral health of children from infancy through the teenage years. It addresses the unique developmental needs of young teeth, including cavity prevention, fluoride treatments, dental sealants, and monitoring the growth of the jaw and incoming adult teeth.\n\nA pediatric dental visit differs from an adult visit in tone, pacing, and communication style. The dentist speaks directly to the child at their level, explains what is happening in gentle, age-appropriate terms, and builds a positive association with dental care early on. This approach reduces dental anxiety that can carry into adulthood and sets the foundation for a lifetime of healthy dental habits. Regular pediatric care also allows the dentist to track dental development and catch emerging issues before they become bigger problems.\n\nEarly dental visits also educate parents. The pediatric team will guide you on nutrition, fluoride, thumb-sucking, and oral hygiene habits that are appropriate for your child is developmental stage. This parent education component is just as important as the clinical care your child receives in the chair.',
      },
      {
        heading: 'Who Is Pediatric Dentistry For?',
        body:
          'Pediatric dentistry is for children from the moment their first tooth appears — typically around six months of age — through adolescence. Parents often bring their children for an inaugural visit by age one or when the first teeth erupt, whichever comes first. Starting early helps children become comfortable with the dental environment and allows the dentist to spot early signs of decay or developmental concerns.\n\nBeyond routine check-ups, pediatric dentistry addresses issues specific to growing mouths: early childhood cavities, thumb-sucking habits, mouth breathing, and uneven bite development. If your child is anxious about the dentist, the pediatric team is trained to create a calm, reassuring experience that earns the child is trust over multiple visits, even if the first few appointments are simply about getting comfortable.\n\nAdolescents have their own set of dental concerns, from wisdom teeth evaluation to sports-related dental injuries. The pediatric team is equipped to manage these transitions and to refer to orthodontic or surgical specialists when a young patient is ready for the next phase of care.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'The pediatric team at Lerio Dental Center in Dumaguete City is experienced in working with children of all ages and temperaments. The clinic environment is designed to feel welcoming and unthreatening for young patients, and every team member takes a patient, encouraging approach so children leave feeling proud of themselves.\n\nDuring a visit, the dentist will count your child is teeth, clean them gently, and apply fluoride if appropriate. Parents are welcome to stay with their child throughout the appointment. The team also spends time with parents, offering practical guidance on at-home care, diet recommendations, and habits that affect oral health as your child grows — such as limiting sugary drinks or thumb-sucking interventions.\n\nThe team is particularly skilled at working with children who have had previous negative experiences at the dentist. Rather than forcing treatment, they build trust gradually, sometimes across several short visits, until the child feels ready. This patience makes a significant difference for anxious young patients.',
      },
      {
        heading: 'Why Parents Choose Us in Dumaguete City',
        body:
          'Parents in Dumaguete City and Negros Oriental choose Lerio Dental Center because the pediatric team genuinely enjoys working with children and it shows in every appointment. The clinic has built a reputation for being the place where kids feel safe, even if they were previously nervous about dental visits. Many parents report that their children actually look forward to their next appointment.\n\nBeyond the positive experience, parents appreciate the thoroughness of care: cavities are caught early, preventive treatments like sealants are applied consistently, and developmental concerns are identified and addressed before they become bigger problems. The team also plans for the transition to adult dentistry as children grow older, ensuring continuity of care through every stage of development.\n\nFor families with children of multiple ages, the ability to have everyone seen at the same clinic — with a team that knows each child is history — is a significant practical advantage. Scheduling siblings back-to-back, with care that is calibrated to each child is age and personality, makes routine dental visits far easier to maintain.',
      },
    ],
    faqs: [
      {
        question: 'At what age should my child first see a dentist?',
        answer:
          'The American Academy of Pediatric Dentistry recommends a first visit by age one or when the first tooth appears, whichever comes first. Your dentist will assess your child is needs at any age you bring them in.',
      },
      {
        question: 'How do I know if my child needs dental sealants?',
        answer:
          'Sealants are often recommended for children is newly erupted permanent molars, which have deep grooves that are difficult to clean with brushing alone. Your dentist will evaluate your child is teeth during a regular visit.',
      },
      {
        question: 'Is pediatric dentistry painful?',
        answer:
          'Routine pediatric care is designed to be as comfortable as possible. The team uses gentle techniques and clear, reassuring communication to keep children calm throughout procedures.',
      },
      {
        question: 'How much does pediatric dental care cost in the Philippines?',
        answer:
          'Costs vary depending on the services provided. Lerio Dental Center discusses all fees upfront so parents know what to expect before any treatment begins.',
      },
    ],
    relatedSlugs: ['general-family-dentistry', 'orthodontics-invisalign'],
  },

  'orthodontics-invisalign': {
    slug: 'orthodontics-invisalign',
    title: 'Orthodontics & Invisalign',
    metaDescription:
      'Certified Invisalign provider in Dumaguete City — orthodontics and clear aligners for a straighter, healthier smile with comfortable, discreet treatment.',
    sections: [
      {
        heading: 'What Are Orthodontics and Invisalign?',
        body:
          'Orthodontics is a specialized branch of dentistry that corrects tooth misalignment, bite problems, and jaw irregularities. Traditional orthodontics uses metal or ceramic brackets bonded to the teeth, connected by wires that apply gentle, consistent pressure to move teeth into proper alignment over time. This method is highly effective for complex cases and has been refined over decades of use.\n\nInvisalign is a modern alternative to traditional braces. It uses a series of custom-made, clear plastic aligners that fit over your teeth and gradually shift them into position. Because the aligners are nearly invisible, many adults and teens prefer this option for its discreteness. Both approaches are effective; the best choice depends on your specific orthodontic needs, the complexity of your case, your lifestyle, and your budget. Lerio Dental Center is a certified Invisalign provider and can recommend the most suitable option for your smile after a thorough assessment.\n\nBeyond aesthetics, properly aligned teeth are easier to clean, distribute bite forces evenly, and reduce wear on tooth enamel over time. Orthodontic treatment is an investment in both the appearance and the long-term health of your smile.',
      },
      {
        heading: 'Who Is Orthodontics For?',
        body:
          'Orthodontic treatment is for anyone with teeth that are crooked, crowded, gapped, or a bite that does not align properly — such as an overbite, underbite, crossbite, or open bite. These issues can affect not only the appearance of your smile but also your ability to chew comfortably, speak clearly, and keep your teeth clean. Crowded teeth are particularly harder to brush and floss effectively, which can increase the risk of cavities and gum disease over time.\n\nAge is not a barrier to orthodontic treatment. While many patients begin treatment during adolescence, adults increasingly seek orthodontics to improve their smile later in life. A consultation with the orthodontic team can determine whether you are a candidate for treatment, what options are available, and how long the process is likely to take based on your specific situation.\n\nIt is worth noting that orthodontic treatment is not purely cosmetic. Misaligned bites can contribute to jaw pain, headaches, and uneven tooth wear that becomes more serious with age. Addressing these issues proactively can prevent more significant problems down the road.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'At Lerio Dental Center, orthodontic treatment begins with a thorough assessment of your teeth, bite, and jaw alignment. The team uses diagnostic tools to understand your specific needs and discusses the available options — including Invisalign and traditional braces — so you can make an informed decision.\n\nIf you choose Invisalign, you will receive a custom series of aligners designed to move your teeth gradually over time. You will wear each set for approximately one to two weeks before switching to the next in the series. Regular check-ins with the team ensure treatment is progressing as planned. For traditional braces, the team adjusts your brackets and wires during periodic office visits to maintain steady, controlled progress toward your target outcome.\n\nOne of the advantages of receiving orthodontic care at a full-service dental clinic is that any other dental issues that arise during treatment — such as cavities or gum concerns — can be addressed in the same place, without disrupting your orthodontic plan or referring you to a new provider.',
      },
      {
        heading: 'Why Patients Choose Us in Dumaguete City',
        body:
          'Lerio Dental Center is a certified Invisalign provider in Dumaguete City, offering patients in Negros Oriental access to modern orthodontic treatment close to home. Rather than being referred to a specialist out of the area, you can manage your orthodontic care in the same clinic where you already receive general and preventive dental services.\n\nThis continuity matters. Your orthodontic treatment is coordinated with any other dental work you may need, and the team already knows your oral health history. Patients also appreciate that the clinic provides honest recommendations — if Invisalign is not the best option for your case, they will tell you and explain why traditional braces may deliver a more predictable result. That honesty builds the trust that keeps patients coming back.\n\nFor families with multiple members in orthodontic treatment, having a single clinic that manages everyone is a practical convenience. The team can coordinate schedules, track family members\' progress, and ensure that everyone\'s overall dental health is being maintained alongside their orthodontic care.',
      },
    ],
    faqs: [
      {
        question: 'How much does orthodontics or Invisalign cost in the Philippines?',
        answer:
          'Costs vary depending on the complexity of your case and the type of treatment chosen. Your dentist will discuss pricing and available payment options during your consultation.',
      },
      {
        question: 'Is Invisalign as effective as traditional braces?',
        answer:
          'Invisalign can be equally effective for many cases of tooth misalignment and bite issues. However, complex bite corrections or significant crowding may respond better to traditional braces. Your dentist will recommend the most effective option for your specific needs.',
      },
      {
        question: 'How long does orthodontic treatment take?',
        answer:
          'Treatment length varies based on the complexity of your case. Mild cosmetic adjustments may take a few months, while comprehensive orthodontic correction can take one to two years or longer. Your dentist will give you an estimate after your assessment.',
      },
      {
        question: 'Do I need a referral for orthodontic treatment?',
        answer:
          'No referral is needed. You can schedule an orthodontic consultation directly at Lerio Dental Center, and the team will determine the best treatment path for your situation.',
      },
    ],
    relatedSlugs: ['general-family-dentistry', 'cosmetic-esthetic-dentistry'],
  },

  'dental-implants-surgery': {
    slug: 'dental-implants-surgery',
    title: 'Dental Implants & Surgery',
    metaDescription:
      'Expert dental implant placement and oral surgery in Dumaguete City — modern implantology for lasting tooth replacement with a focus on patient comfort.',
    sections: [
      {
        heading: 'What Are Dental Implants and Oral Surgery?',
        body:
          'Dental implants are titanium posts surgically placed into the jawbone to serve as a stable foundation for a replacement tooth, bridge, or denture. The implant itself acts like a tooth root, bonding with the bone over time through a process called osseointegration. Once healed, a custom-made crown or restoration is attached to the post, creating a replacement that looks, feels, and functions like a natural tooth.\n\nOral surgery encompasses a broader range of surgical procedures related to the mouth, jaw, and face. Beyond implants, this includes tooth extractions (including impacted wisdom teeth), bone grafting to rebuild lost bone, sinus lifts for upper jaw implants, and treatment of oral pathology. The common thread is that these procedures require precise surgical technique, modern equipment, and careful post-operative care for optimal healing and long-term success.\n\nOne of the significant advances in implant dentistry is the predictability of modern techniques. With proper planning and execution, dental implants have high success rates and can last many years — often decades — with good care. This makes them a cost-effective long-term solution compared to alternatives that may need more frequent replacement.',
      },
      {
        heading: 'Who Is Dental Implant Surgery For?',
        body:
          'Dental implants are an option for adults who have lost one or more teeth due to injury, gum disease, or tooth decay. Good candidates generally have healthy gums, sufficient bone density in the jaw to support the implant, and no uncontrolled health conditions that would significantly impair healing after surgery.\n\nEven if you have experienced bone loss over time, treatments like bone grafting can sometimes rebuild the jawbone enough to support implants. Your dentist will evaluate your specific situation through a clinical examination and imaging to determine whether implants are a viable option. If implants are not currently suitable, the team will discuss alternative prosthetic solutions such as bridges or dentures that can still restore function and appearance.\n\nMissing teeth are not just a cosmetic concern. When a tooth is lost and not replaced, the surrounding teeth can shift, bone loss in the jaw accelerates, and the bite relationship can change in ways that affect chewing and jaw comfort. Replacing missing teeth — whether with implants, bridges, or dentures — is an important investment in your long-term oral health.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'Implant surgery and oral surgical procedures at Lerio Dental Center are performed with modern techniques and thorough pre-operative planning. The team begins with a detailed assessment, including imaging, to understand the exact anatomy and plan the procedure precisely before any surgical work begins.\n\nPatient comfort is a priority throughout. The team explains every step of the process so you know what to expect before, during, and after surgery. Local anesthesia is used to keep you comfortable during the procedure, and detailed post-operative instructions are provided to support smooth healing. If sedation is appropriate for your procedure, the team will discuss that option with you during your consultation so you can make an informed choice.\n\nAfter surgery, the team remains available for follow-up care and questions. Healing timelines vary by patient and by procedure, and the team will check your progress at appropriate intervals to ensure everything is healing as expected before proceeding to the final restoration.',
      },
      {
        heading: 'Why Patients Choose Us in Dumaguete City',
        body:
          'Patients in Dumaguete City and Negros Oriental choose Lerio Dental Center for implant surgery because the team combines surgical expertise with a patient-first approach. Rather than rushing through consultations, the team takes time to explain all available options, their risks and benefits, and what results you can realistically expect from treatment.\n\nThe clinic is equipped with the instruments and sterilization protocols necessary for safe surgical care. For complex cases requiring multi-step treatment — such as bone grafting followed by implant placement and then final restoration — the same team coordinates your care throughout the entire process. This continuity reduces the fragmentation that often happens when surgical and restorative care are split between different providers in different locations.\n\nBeing able to complete the entire implant process — from surgical placement through final crown — in the same clinic means fewer referrals, fewer separate appointments at unfamiliar offices, and a consistent team who knows your case from start to finish. For patients traveling from outside Dumaguete City, this is especially valuable.',
      },
    ],
    faqs: [
      {
        question: 'How much do dental implants cost in the Philippines?',
        answer:
          'Implant costs vary depending on the number of implants, the need for bone grafting, and the type of restoration used. Your dentist will provide a detailed cost estimate during your consultation.',
      },
      {
        question: 'Is dental implant surgery painful?',
        answer:
          'The procedure is performed under anesthesia, so you will not feel pain during surgery. Some discomfort is normal during the healing phase, which can be managed with prescribed or recommended pain relief.',
      },
      {
        question: 'How long does it take to get a dental implant?',
        answer:
          'The process varies by patient. Simple cases may be completed in a few months from implant placement to final restoration. Complex cases involving bone grafting or multiple implants can take six months to a year or longer.',
      },
      {
        question: 'How do I know if I need oral surgery?',
        answer:
          'Your dentist will evaluate your oral health and recommend surgery only when it is clinically necessary. Common reasons include impacted teeth, significant bone loss requiring grafting, or missing teeth that would benefit from implant-supported replacement.',
      },
    ],
    relatedSlugs: ['prosthodontics', 'root-canal-therapy'],
  },

  'root-canal-therapy': {
    slug: 'root-canal-therapy',
    title: 'Root Canal Therapy',
    metaDescription:
      'Gentle root canal treatment in Dumaguete City — relieve tooth pain and save your natural tooth with modern endodontic care in a calm, comfortable setting.',
    sections: [
      {
        heading: 'What Is Root Canal Therapy?',
        body:
          'Root canal therapy, also known as endodontic treatment, is a procedure designed to save a tooth that has become infected or inflamed at its core. Inside every tooth is a soft tissue called the dental pulp, which contains nerves, blood vessels, and connective tissue. When decay, a crack, or trauma allows bacteria to reach the pulp, infection can follow, causing persistent pain, swelling, and potentially more serious complications if left untreated.\n\nDuring a root canal, the dentist removes the infected or inflamed pulp from inside the tooth, cleans and disinfects the root canals, and then fills and seals the space with a biocompatible material. This relieves pain and allows you to keep your natural tooth rather than having it extracted. A crown is typically placed over the treated tooth to protect it and restore its full function. Modern root canal treatment is typically no more uncomfortable than a routine filling and is often completed in a single visit.\n\nSaving your natural tooth, when possible, is almost always the best option. An extracted tooth can lead to bone loss in the jaw, shifting of surrounding teeth, and changes in bite alignment that may require further treatment. A successful root canal preserves your natural dentition and avoids these downstream consequences.',
      },
      {
        heading: 'Who Is Root Canal Therapy For?',
        body:
          'Root canal therapy is for anyone experiencing symptoms of an infected or inflamed tooth pulp. Signs that you may need a root canal include persistent tooth pain that does not subside, sensitivity to hot or cold that lingers after the source is removed, swelling or tenderness in the gums near a specific tooth, darkening of a tooth, or a pimple-like bump on the gums that may indicate an abscess.\n\nNot all tooth pain indicates the need for a root canal — some issues can be resolved with simpler treatments like a filling or antibiotic therapy. Your dentist will examine the affected tooth and may take an X-ray to determine whether the pulp is involved. If a root canal is necessary, it is always better to address it sooner rather than later to prevent the infection from spreading to other teeth or into the jawbone.\n\nIf you are experiencing dental pain, do not wait to seek care. An infected tooth that is left untreated can lead to a systemic infection, swelling that affects breathing or swallowing, or the loss of the tooth entirely. Early evaluation is the best way to preserve your options and minimize the complexity of treatment.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'At Lerio Dental Center, root canal therapy is performed with a focus on patient comfort at every step. The team understands that the phrase root canal can cause anxiety, and they take that seriously. The procedure is explained clearly in advance so you know exactly what is happening and why at each stage.\n\nLocal anesthesia is used to thoroughly numb the area. The dentist then accesses the pulp chamber, removes the infected tissue, and cleans the canals with precision using modern rotary instruments and irrigation techniques that help ensure thorough disinfection. Once the canals are filled and sealed, the tooth is prepared for a crown to restore its strength and appearance. Most patients are pleasantly surprised at how manageable the experience is compared to their expectations.\n\nAfter the procedure, the team will discuss what to expect during the healing period and what signs to watch for that would warrant a call to the clinic. A follow-up appointment is typically scheduled to confirm healing and to place the final crown once the tooth has settled.',
      },
      {
        heading: 'Why Patients Choose Us in Dumaguete City',
        body:
          'Patients in Dumaguete City and Negros Oriental trust Lerio Dental Center for root canal therapy because the team takes a conservative, honest approach. If a root canal can save your tooth, they will tell you and explain the process clearly. If an extraction is a more practical option in your situation, they will explain that too — along with the replacement options available so you can make an informed decision.\n\nThe clinic is equipped for the full scope of endodontic care, from diagnosis through final restoration. After your root canal, the same team places the crown or other restoration, so the work is coordinated and consistent from start to finish. This continuity reduces the risk of complications that can occur when treatment is fragmented across different providers who may not fully communicate with each other.\n\nMany patients are referred to the clinic by friends and family members who have had successful root canal treatment there. This word-of-mouth trust is something the team takes pride in and works to maintain with every patient who walks through the door.',
      },
    ],
    faqs: [
      {
        question: 'Is root canal therapy painful?',
        answer:
          'Modern root canal treatment is not the painful experience it once was. With effective anesthesia and gentle modern technique, most patients report that the procedure is no more uncomfortable than a routine filling.',
      },
      {
        question: 'How much does a root canal cost in the Philippines?',
        answer:
          'Costs vary depending on the tooth involved and whether additional procedures such as a crown are needed afterward. Your dentist will discuss transparent pricing during your consultation.',
      },
      {
        question: 'How long does a root canal take?',
        answer:
          'Many root canals can be completed in a single visit. Teeth with more complex canal systems or active infections may require an additional appointment. Your dentist will give you a clearer timeline after evaluating your tooth.',
      },
      {
        question: 'How do I know if I need a root canal or an extraction?',
        answer:
          'Your dentist will examine the tooth and take X-rays to determine the extent of the damage or infection. If the tooth can be saved with a root canal, that is always the preferred option. Your dentist will explain the recommendation and all available alternatives.',
      },
    ],
    relatedSlugs: ['general-family-dentistry', 'dental-implants-surgery'],
  },

  'prosthodontics': {
    slug: 'prosthodontics',
    title: 'Prosthodontics',
    metaDescription:
      'Expert prosthodontic care in Dumaguete City — crowns, bridges, and dentures crafted to restore the function, comfort, and appearance of your smile.',
    sections: [
      {
        heading: 'What Is Prosthodontics?',
        body:
          'Prosthodontics is the dental specialty focused on the design, manufacture, and fitting of artificial replacements for teeth and oral structures. This includes crowns, which cap and protect a damaged tooth; bridges, which replace one or more missing teeth by anchoring to adjacent natural teeth; and dentures, which replace all or most of the teeth in an arch. Prosthodontic treatment restores the ability to chew and speak comfortably while also improving the appearance of your smile.\n\nProsthetic devices are custom-made for each patient based on detailed impressions and measurements of the mouth. The goal is a precise fit that feels comfortable, functions well for eating and speaking, and looks natural. Materials used include porcelain, ceramic, metal alloys, and acrylic, often in combination to balance strength, durability, and esthetics. Your dentist will recommend the most appropriate material and design for your specific situation.\n\nAdvances in dental materials have made modern prosthetics more natural-looking and comfortable than ever before. Porcelain and ceramic options especially can mimic the translucency and color variation of natural teeth, making it difficult to distinguish prosthetic teeth from the real thing.',
      },
      {
        heading: 'Who Is Prosthodontics For?',
        body:
          'Prosthodontic treatment is for anyone missing one or more teeth, or for patients whose teeth are severely damaged, worn, or discolored in ways that cannot be corrected with simpler treatments. Patients with congenital conditions that affect tooth development, or patients who have lost teeth due to injury, gum disease, or decay, are all candidates for prosthodontic care.\n\nEven patients who already wear dentures may benefit from prosthodontic care — whether it is having existing dentures adjusted for a better fit, receiving new custom-fitted dentures, or exploring implant-supported alternatives that offer greater stability and comfort. The right time to see a prosthodontist is when tooth loss or damage is affecting your ability to eat comfortably, speak clearly, or feel confident in social situations.\n\nBeyond appearance, missing teeth affect how you eat and speak. Difficulty chewing can limit your diet and affect nutrition, while missing front teeth can alter speech patterns. Prosthodontic treatment addresses all of these functional concerns, not just the cosmetic ones.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'At Lerio Dental Center, prosthodontic treatment begins with a comprehensive evaluation of your teeth, gums, bite, and jaw. The team discusses your goals — whether you want to restore full chewing function, improve the appearance of your smile, or both — and then recommends the most appropriate prosthetic solution based on your oral health and budget.\n\nImpressions and measurements are taken with care to ensure accuracy. The prosthetic device is crafted to match the color, shape, and proportion of your natural teeth or to create the smile you want. Fitting appointments allow the team to make precise adjustments for comfort and function. Throughout the process, you are encouraged to ask questions, share what feels right, and be involved in the outcome.\n\nIf you are transitioning from failing teeth to dentures, the team will walk you through what to expect at each stage of the process. Many patients are surprised at how natural modern dentures can look and feel, and the team will not rest until you are satisfied with the result.',
      },
      {
        heading: 'Why Patients Choose Us in Dumaguete City',
        body:
          'Patients in Dumaguete City and Negros Oriental choose Lerio Dental Center for prosthodontic care because the team takes a thorough, patient-centered approach to tooth replacement and restoration. Rather than rushing to a prosthetic solution, the team evaluates the underlying oral health to ensure the best long-term outcome — not just a quick fix.\n\nThe clinic is equipped with the facilities and materials needed to create durable, natural-looking prosthetics. Whether you need a single crown, a bridge to replace several teeth, or a full or partial denture, the same experienced team manages your care from initial consultation through final fitting. This continuity means the people who know your mouth best are the ones crafting and placing your prosthetic, which leads to better outcomes and fewer complications.\n\nFor patients replacing multiple teeth or full arches, having the same team handle the entire process from extractions through final prosthetics provides significant peace of mind. You are never passed between unfamiliar providers, and the team is invested in the outcome because they have been with you from the beginning.',
      },
    ],
    faqs: [
      {
        question: 'How much do crowns, bridges, or dentures cost in the Philippines?',
        answer:
          'Costs vary based on the type of prosthetic, the materials used, and the number of teeth involved. Your dentist will provide a clear cost breakdown during your consultation.',
      },
      {
        question: 'How long do crowns and bridges last?',
        answer:
          'With proper care and good oral hygiene, crowns and bridges can last many years — often a decade or more. Your dentist will discuss how to maximize the lifespan of your prosthetic during your appointment.',
      },
      {
        question: 'Are dentures uncomfortable?',
        answer:
          'New dentures can feel unfamiliar for the first few weeks as your mouth adjusts to the appliance. The team at Lerio Dental Center takes time to fit and adjust dentures carefully to minimize discomfort and ensure they function well for everyday use.',
      },
      {
        question: 'Do I need implants before getting a bridge or denture?',
        answer:
          'Not necessarily. Traditional bridges anchor to adjacent natural teeth, and conventional dentures rest directly on the gums. However, implant-supported options offer greater stability and can prevent bone loss. Your dentist will explain the pros and cons of each during your consultation.',
      },
    ],
    relatedSlugs: ['dental-implants-surgery', 'cosmetic-esthetic-dentistry'],
  },

  'geriatric-dentistry': {
    slug: 'geriatric-dentistry',
    title: 'Geriatric Dentistry',
    metaDescription:
      'Gentle, specialized dental care for seniors in Dumaguete City — comfortable treatment plans adapted to long-term health, mobility, and quality of life.',
    sections: [
      {
        heading: 'What Is Geriatric Dentistry?',
        body:
          'Geriatric dentistry is dental care adapted to meet the specific needs of older adults. As we age, oral health challenges can become more complex: teeth may wear down or become loose, gums may recede, dry mouth caused by common medications can increase the risk of cavities, and existing dental restorations may need maintenance or replacement. Geriatric dentistry addresses these changes with treatment plans that thoughtfully consider overall health, medication interactions, and the practical realities of aging.\n\nThis branch of dentistry also considers factors like reduced manual dexterity, which can affect brushing and flossing ability, and medical conditions such as diabetes, osteoporosis, or cardiovascular disease that have direct implications for oral health and healing. The goal is to maintain oral function, comfort, and dignity throughout the senior years, supporting overall quality of life and nutritional health.\n\nGood oral health in the senior years is closely linked to general health outcomes. Research has shown connections between gum disease and conditions such as heart disease and diabetes. Keeping teeth and gums healthy is not just about eating and speaking comfortably — it is an important part of overall health management for older adults.',
      },
      {
        heading: 'Who Is Geriatric Dentistry For?',
        body:
          'Geriatric dentistry is for any older adult who wants to maintain their oral health or address dental problems that have become more complex with age. This includes seniors who still have their natural teeth, those who wear dentures or partials, and patients managing multiple health conditions that interact with their dental care and medication regimens.\n\nYou may seek geriatric dental care if you are experiencing difficulty chewing, tooth sensitivity, mouth pain, dry mouth, or concerns about the fit or function of your existing dentures. It is also appropriate for caregivers looking for a dental team experienced in the unique needs of older patients, including those with limited mobility who may benefit from a clinic that is easy to access and navigate.\n\nMany older adults were not encouraged to prioritize dental care earlier in life and may feel embarrassed about the state of their teeth. The geriatric dental team is experienced in working without judgment, meeting patients where they are, and creating practical treatment plans that respect each person is history and current circumstances.',
      },
      {
        heading: 'What to Expect at Lerio Dental Center',
        body:
          'At Lerio Dental Center in Dumaguete City, the geriatric dental team takes time to understand each patient is full health picture. Your medical history, current medications, and any physical limitations are carefully reviewed and considered when developing a treatment plan. The clinic is located on the ground floor of Dr. V. Locsin Street, making it accessible for patients with mobility considerations.\n\nAppointments are structured to be unhurried. The team explains every procedure clearly and works at a pace that feels comfortable for the patient. Whether you need a routine cleaning, a denture adjustment, treatment for gum disease, or more complex restorative work, the approach is gentle and respectful throughout. Your comfort and dignity are treated as a priority at every visit.\n\nThe team also coordinates with other healthcare providers when needed. If you are managing conditions such as diabetes, heart disease, or osteoporosis, the dentist may consult with your physician to ensure dental treatment is planned safely and does not interfere with other aspects of your care.',
      },
      {
        heading: 'Why Patients and Families Choose Us in Dumaguete City',
        body:
          'Families in Dumaguete City and Negros Oriental trust Lerio Dental Center for the dental care of their older relatives because the team combines clinical expertise with genuine compassion. The clinic is known for its patient-first approach, which resonates especially with senior patients who may have had negative dental experiences earlier in life and carry that anxiety forward.\n\nThe team coordinates with other healthcare providers when needed, particularly for patients with complex medical histories involving multiple specialists. Treatment plans are designed with the patient is long-term comfort and health in mind, not just immediate fixes. This approach reflects the clinic is broader commitment to transparent, personalized care — the same values that guide every aspect of their practice.\n\nFor family members who cannot always accompany their loved ones to appointments, the team provides clear communication about treatment plans, costs, and progress. This transparency gives families confidence that their relatives are receiving thoughtful, appropriate care — even when they cannot be there in person.',
      },
    ],
    faqs: [
      {
        question: 'Is dental treatment safe for older adults?',
        answer:
          'Yes, with appropriate precautions. Your dentist will review your complete medical history and medications to ensure any recommended treatment is safe and appropriate for your specific health situation.',
      },
      {
        question: 'How much does geriatric dental care cost in the Philippines?',
        answer:
          'Costs depend on the type of treatment needed. Lerio Dental Center discusses all fees upfront so patients and families know what to expect before beginning any work.',
      },
      {
        question: 'My parent has difficulty opening their mouth for dental exams. Can they still be treated?',
        answer:
          'The team is experienced in working with patients who have physical limitations, including restricted jaw opening. Treatment approaches can be adapted to ensure care is thorough and as comfortable as possible.',
      },
      {
        question: 'Do I need a referral for geriatric dental care?',
        answer:
          'No referral is needed. You can schedule an appointment directly, and the team will assess your parent or family member is needs during the first visit and recommend an appropriate care plan.',
      },
    ],
    relatedSlugs: ['general-family-dentistry', 'prosthodontics'],
  },
};
