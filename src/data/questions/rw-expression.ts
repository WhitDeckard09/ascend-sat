import type { Question } from '../types'

/**
 * Expression of Ideas — 20% of Reading & Writing.
 * Transitions and rhetorical synthesis (turning research notes into a sentence
 * that accomplishes a stated goal).
 */
export const expressionOfIdeas: Question[] = [
  // ---------------------------------------------------------------- EASY
  {
    id: 'rw-eoi-001', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 1, type: 'mc',
    passage: `Sea otters eat enormous quantities of sea urchins, which in turn graze on kelp. ______ where otter populations are healthy, kelp forests tend to thrive.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'Consequently,', 'In contrast,', 'For instance,'],
    answer: 1,
    explanation: 'Otters eat urchins, urchins eat kelp, so more otters means more kelp. The second sentence is the effect of the first, which "Consequently" signals.',
    trap: '"Nevertheless" would signal a contrast, but the two sentences agree.',
  },
  {
    id: 'rw-eoi-002', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 1, type: 'mc',
    passage: `Most bird species build a new nest each breeding season. ______ bald eagles return to the same nest year after year, adding material until some structures weigh more than a ton.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Similarly,', 'Therefore,', 'However,', 'Moreover,'],
    answer: 2,
    explanation: 'Eagles behave differently from "most bird species," so the sentence needs a contrast word.',
    trap: '"Similarly" would claim the two behaviors match, but the passage sets them against each other.',
  },
  {
    id: 'rw-eoi-003', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 1, type: 'mc',
    passage: `The city's transit agency has expanded its bus fleet substantially over the past decade. ______ it has added 240 vehicles and opened three new depots.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Specifically,', 'Instead,', 'Regardless,', 'Conversely,'],
    answer: 0,
    explanation: 'The second sentence gives the numbers behind the general claim in the first. "Specifically" introduces that detail.',
    trap: '"Regardless" would dismiss the first sentence rather than support it.',
  },
  {
    id: 'rw-eoi-004', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 1, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Mae Jemison is a physician and engineer.
• In 1992 she flew aboard the space shuttle Endeavour.
• She was the first Black woman to travel to space.
• She left NASA in 1993 to found a technology research company.`,
    prompt: 'The student wants to emphasize the historical significance of Jemison’s 1992 flight. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Mae Jemison, a physician and engineer, left NASA in 1993 to found a technology research company.',
      'When Mae Jemison flew aboard the space shuttle Endeavour in 1992, she became the first Black woman to travel to space.',
      'Mae Jemison, who is both a physician and an engineer, flew aboard the space shuttle Endeavour.',
      'After founding a technology research company, Mae Jemison worked as a physician and engineer.',
    ],
    answer: 1,
    explanation: 'The goal is historical significance. Only choice B pairs the 1992 flight with the "first Black woman in space" fact that makes it historic.',
    trap: 'Choice C names the flight but drops the detail that gives it significance.',
  },
  {
    id: 'rw-eoi-005', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 1, type: 'mc',
    passage: `Aluminum is one of the most abundant metals in the Earth's crust. ______ it was so difficult to isolate in the nineteenth century that Napoleon III reportedly reserved aluminum cutlery for his most honored guests.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Accordingly,', 'Yet', 'Likewise,', 'In addition,'],
    answer: 1,
    explanation: 'Abundance and extreme preciousness are surprising together. "Yet" marks that tension.',
    trap: '"Accordingly" would suggest the rarity follows from the abundance, which is backwards.',
  },
  {
    id: 'rw-eoi-006', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 1, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Great Barrier Reef stretches roughly 1,400 miles.
• It is composed of about 3,000 individual reefs.
• It is visible from low Earth orbit.
• It supports more than 1,500 species of fish.`,
    prompt: 'The student wants to emphasize the scale of the reef system. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Great Barrier Reef supports more than 1,500 species of fish.',
      'Composed of about 3,000 individual reefs, the Great Barrier Reef stretches roughly 1,400 miles and is visible from low Earth orbit.',
      'The Great Barrier Reef, which supports many fish species, is composed of individual reefs.',
      'Visible from low Earth orbit, the Great Barrier Reef supports more than 1,500 species of fish.',
    ],
    answer: 1,
    explanation: 'Scale is best conveyed by size figures. Choice B stacks the three magnitude facts — 3,000 reefs, 1,400 miles, visible from orbit.',
    trap: 'Choice D mixes one scale fact with a biodiversity fact, diluting the emphasis on size.',
  },
  {
    id: 'rw-eoi-007', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 1, type: 'mc',
    passage: `Researchers expected the treated seedlings to outgrow the untreated ones within a month. ______ after six weeks the two groups were indistinguishable in height.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['In fact,', 'For example,', 'Furthermore,', 'As a result,'],
    answer: 0,
    explanation: 'The outcome contradicts the expectation. "In fact" introduces the corrective reality.',
    trap: '"As a result" would make the null outcome a consequence of the expectation, which makes no sense.',
  },
  {
    id: 'rw-eoi-008', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 1, type: 'mc',
    passage: `Glass is often described as a slow-moving liquid, an idea supported by the observation that old cathedral windows are thicker at the bottom. ______ medieval glassmakers produced uneven panes, and glaziers routinely installed the thicker edge downward for stability.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Consequently,', 'In reality,', 'Similarly,', 'Meanwhile,'],
    answer: 1,
    explanation: 'The second sentence supplies the true explanation, displacing the popular one. "In reality" performs that correction.',
    trap: '"Meanwhile" suggests simultaneity rather than correction.',
  },

  // -------------------------------------------------------------- MEDIUM
  {
    id: 'rw-eoi-009', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 2, type: 'mc',
    passage: `Adding a second lane to a congested highway typically reduces travel time only briefly. The improved conditions attract drivers who had previously avoided the route or traveled at other hours; ______ congestion returns to roughly its former level within a few years.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nonetheless,', 'by contrast,', 'as a result,', 'admittedly,'],
    answer: 2,
    explanation: 'Attracting additional drivers is the cause; the return of congestion is its effect. "As a result" states that causal link.',
    trap: '"Nonetheless" would suggest congestion returned despite the influx of drivers, when it returned because of them.',
  },
  {
    id: 'rw-eoi-010', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 2, type: 'mc',
    passage: `The team's model reproduced the observed temperature record with high fidelity. It did so, ______ , only after several parameters were tuned to values that laboratory measurements do not support.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['therefore', 'however', 'moreover', 'likewise'],
    answer: 1,
    explanation: 'The second sentence undercuts the success reported in the first. "However" marks the concession-and-qualification move.',
    trap: '"Moreover" would add a second point in the same direction, but this point cuts against the first.',
  },
  {
    id: 'rw-eoi-011', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Hedy Lamarr was a film actor in the 1930s and 1940s.
• With composer George Antheil she patented a frequency-hopping system in 1942.
• The system was designed to keep radio-guided torpedoes from being jammed.
• Frequency hopping underlies modern Bluetooth and Wi-Fi.
• The patent expired before Lamarr received any payment for it.`,
    prompt: 'The student wants to explain the lasting technical relevance of Lamarr’s invention. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Hedy Lamarr, a film actor in the 1930s and 1940s, patented a frequency-hopping system with composer George Antheil in 1942.',
      'Although Lamarr’s patent expired before she was ever paid for it, she had been a successful film actor.',
      'The frequency-hopping system Lamarr patented in 1942 to protect radio-guided torpedoes from jamming is the basis of modern Bluetooth and Wi-Fi.',
      'George Antheil, a composer, worked with the film actor Hedy Lamarr on a 1942 patent.',
    ],
    answer: 2,
    explanation: 'Lasting technical relevance requires connecting the 1942 invention to technologies still in use. Only choice C makes that link.',
    trap: 'Choice A is accurate and well-written but stops in 1942, saying nothing about lasting relevance.',
  },
  {
    id: 'rw-eoi-012', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 2, type: 'mc',
    passage: `Most fungi decompose dead matter. Certain species, ______ , attack living plants, and a handful have evolved to trap and digest nematodes using constricting rings that inflate in a tenth of a second.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for example', 'in other words', 'though', 'consequently'],
    answer: 2,
    explanation: 'The sentence describes fungi that depart from the norm just stated. "Though" as an interrupter carries that contrast.',
    trap: '"For example" would present these predatory fungi as instances of decomposers, which they are not.',
  },
  {
    id: 'rw-eoi-013', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Ada Blackjack joined a 1921 Arctic expedition as a seamstress.
• The four men on the expedition died or disappeared.
• Blackjack survived alone on Wrangel Island for two years.
• She taught herself to trap foxes and shoot seals.
• She was rescued in 1923.`,
    prompt: 'The student wants to emphasize the resourcefulness Blackjack demonstrated after being left alone. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Ada Blackjack joined a 1921 Arctic expedition as a seamstress and was rescued in 1923.',
      'After the four men on her 1921 expedition died or disappeared, Blackjack taught herself to trap foxes and shoot seals, surviving alone on Wrangel Island for two years.',
      'Ada Blackjack, who was rescued in 1923, had joined an Arctic expedition two years earlier as a seamstress.',
      'The four men on the 1921 Arctic expedition died or disappeared before Blackjack was rescued in 1923.',
    ],
    answer: 1,
    explanation: 'Resourcefulness requires the skills she taught herself. Choice B supplies the trapping and shooting alongside the two years alone.',
    trap: 'Choice A tells you she survived the interval but names no action she took, which is what resourcefulness means.',
  },
  {
    id: 'rw-eoi-014', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 2, type: 'mc',
    passage: `Critics of the policy warned that it would depress hiring among small firms. Employment at firms with fewer than fifty workers rose 4 percent over the following two years. ______ the critics have argued that the growth would have been larger still without the policy — a claim that is difficult to test.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Accordingly,', 'In response,', 'Similarly,', 'For instance,'],
    answer: 1,
    explanation: 'The critics are reacting to evidence that contradicts their warning. "In response" names that rhetorical move.',
    trap: '"Accordingly" would make the critics’ new claim follow logically from the employment growth, but it works against it.',
  },
  {
    id: 'rw-eoi-015', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 2, type: 'mc',
    passage: `The manuscript's ink contains iron gall, consistent with European production. Its parchment, ______ , was prepared using a technique documented only in workshops in the eastern Mediterranean.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['likewise', 'on the other hand', 'as a result', 'in short'],
    answer: 1,
    explanation: 'Two pieces of physical evidence point to different origins. The transition must mark that opposition.',
    trap: '"Likewise" would say the parchment agrees with the ink, but the two indicate different regions.',
  },
  {
    id: 'rw-eoi-016', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The vaquita is a porpoise found only in the northern Gulf of California.
• Fewer than fifteen individuals were estimated to remain as of recent surveys.
• Vaquitas drown in gillnets set illegally for the totoaba fish.
• Totoaba swim bladders are sold at high prices in some overseas markets.
• Vaquitas have never been observed to be targeted directly by fishers.`,
    prompt: 'The student wants to explain why the vaquita is endangered despite not being hunted. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The vaquita, a porpoise found only in the northern Gulf of California, numbers fewer than fifteen individuals.',
      'Totoaba swim bladders sell at high prices in some overseas markets, which encourages illegal fishing.',
      'Though vaquitas are never targeted directly, they drown in gillnets set illegally for totoaba, whose swim bladders fetch high prices overseas.',
      'Fewer than fifteen vaquitas remain, and the species is found only in the northern Gulf of California.',
    ],
    answer: 2,
    explanation: 'The goal has two parts — endangered, but not hunted. Choice C states the non-targeting, the bycatch mechanism, and the economic driver behind it.',
    trap: 'Choice B explains the illegal fishing but never connects it to the vaquita, leaving the goal unmet.',
  },
  {
    id: 'rw-eoi-017', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 2, type: 'mc',
    passage: `The alloy is unusually resistant to corrosion and retains its strength at high temperature. It is, ______ , expensive enough that its use has been restricted to aerospace components where no substitute performs adequately.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['in addition', 'for instance', 'however', 'thus'],
    answer: 2,
    explanation: 'The first sentence lists advantages; the second introduces the drawback that limits use. "However" marks the reversal.',
    trap: '"In addition" would file the cost alongside the advantages, but cost is the constraint, not a benefit.',
  },
  {
    id: 'rw-eoi-018', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Bessie Coleman could not obtain a pilot's license in the United States in 1920.
• She learned French and traveled to France to train.
• She earned an international pilot's license in 1921.
• She became the first African American woman to hold one.
• She performed in air shows and refused to appear before segregated audiences.`,
    prompt: 'The student wants to emphasize the obstacles Coleman overcame in order to become a pilot. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Bessie Coleman performed in air shows and refused to appear before segregated audiences.',
      'Bessie Coleman earned an international pilot’s license in 1921, becoming the first African American woman to hold one.',
      'Unable to obtain a pilot’s license in the United States, Coleman learned French, trained in France, and earned an international license in 1921.',
      'In 1921 Bessie Coleman, who spoke French, was performing in air shows across the United States.',
    ],
    answer: 2,
    explanation: 'Obstacles means what stood in her way and what she did about it: barred at home, so she learned a language and left the country.',
    trap: 'Choice B states the achievement without any of the barriers she had to get around.',
  },

  // ---------------------------------------------------------------- HARD
  {
    id: 'rw-eoi-019', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `The excavation yielded no weapons, no fortification, and no skeletal trauma of the kind associated with warfare. The site's occupants were not, ______ , necessarily peaceful; organic weapons such as wooden clubs would leave no trace in this soil chemistry, and the sample of recovered burials is small.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for that reason', 'in particular', 'by comparison', 'as expected'],
    answer: 0,
    explanation: 'The sentence denies that the absence of evidence licenses the peaceful conclusion — that is, they were not peaceful *for that reason*, even if the reason is the one just given.',
    trap: '"In particular" would narrow the previous statement rather than blocking an inference drawn from it.',
  },
  {
    id: 'rw-eoi-020', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `Proponents argue that the reservoir will secure the region's water supply through the next several decades. That estimate assumes inflows at the twentieth-century average. Tree-ring reconstructions indicate that the twentieth century was among the wettest hundred-year periods of the past millennium; ______ the baseline underlying the projection may itself be anomalous.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nevertheless,', 'in other words,', 'for example,', 'previously,'],
    answer: 1,
    explanation: 'The final clause restates the implication of the tree-ring finding in plain terms. "In other words" performs that reformulation.',
    trap: '"Nevertheless" implies contrast, but the last clause agrees with and interprets the sentence before it.',
  },
  {
    id: 'rw-eoi-021', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Tulsa Race Massacre destroyed the Greenwood District in 1921.
• Greenwood had been one of the wealthiest Black communities in the United States.
• No insurance claims for riot damage were paid to Black residents.
• The city later rezoned much of the district for industrial use.
• A 2001 state commission recommended reparations; none were paid.`,
    prompt: 'The student wants to explain how the district’s destruction became permanent rather than temporary. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Tulsa Race Massacre of 1921 destroyed Greenwood, one of the wealthiest Black communities in the United States.',
      'A 2001 state commission recommended reparations for the destruction of Greenwood, but none were paid.',
      'Greenwood was destroyed in 1921, and rebuilding was foreclosed when insurance claims went unpaid and the city rezoned much of the district for industrial use.',
      'Greenwood, one of the wealthiest Black communities in the country, was rezoned by the city for industrial use.',
    ],
    answer: 2,
    explanation: 'Permanence requires the mechanisms that prevented recovery. Choice C names both — unpaid claims removed the capital, rezoning removed the legal possibility.',
    trap: 'Choice B is about redress decades later, not about why rebuilding did not happen in the first place.',
  },
  {
    id: 'rw-eoi-022', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `Machine translation systems trained on parallel corpora reproduce the register of their training data. A model trained largely on parliamentary proceedings will render casual speech in a stiff, formal idiom. ______ the failure is not a shortage of vocabulary but a mismatch between the distribution the model learned and the distribution it is asked to produce.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Critically,', 'Alternatively,', 'Afterward,', 'Granted,'],
    answer: 0,
    explanation: 'The last sentence identifies the essential point about the preceding example — an emphasis marker is what the slot needs.',
    trap: '"Granted" concedes ground to an opposing view, but this sentence sharpens the author’s own analysis rather than yielding.',
  },
  {
    id: 'rw-eoi-023', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Katalin Karikó studied mRNA at the University of Pennsylvania beginning in 1989.
• Her grant applications were repeatedly rejected.
• She was demoted in 1995 rather than placed on a tenure track.
• With Drew Weissman she solved the problem of mRNA triggering immune rejection in 2005.
• The 2005 work made mRNA vaccines possible.`,
    prompt: 'The student wants to emphasize the gap between the reception of Karikó’s work and its eventual importance. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Katalin Karikó began studying mRNA at the University of Pennsylvania in 1989 and worked with Drew Weissman.',
      'Repeatedly denied grants and demoted in 1995, Karikó went on to solve, with Drew Weissman, the immune-rejection problem that had blocked mRNA vaccines.',
      'In 2005 Karikó and Weissman solved the problem of mRNA triggering immune rejection, making mRNA vaccines possible.',
      'Karikó’s grant applications were repeatedly rejected, and in 1995 she was demoted rather than placed on a tenure track.',
    ],
    answer: 1,
    explanation: 'The goal names a gap, so the sentence needs both halves. Choice B puts the rejections and demotion against the breakthrough in a single contrastive structure.',
    trap: 'Choices C and D each give one side cleanly, but a gap cannot be shown with one side alone.',
  },
  {
    id: 'rw-eoi-024', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `Behavioral studies had established that the birds could discriminate the local dialect of their species' song from foreign dialects. What remained unclear was whether the discrimination reflected learning or an inherited template. Hand-reared birds that had never heard adult song were tested at maturity; ______ they showed no preference for the local dialect, indicating that the discrimination is acquired.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nonetheless,', 'in turn,', 'notably,', 'by contrast,'],
    answer: 2,
    explanation: 'The result is the decisive finding of the experiment. "Notably" flags its significance without asserting a contrast or a causal chain that the sentence does not support.',
    trap: '"By contrast" needs two things being compared in the same sentence structure; here the clause reports the outcome of the test just described.',
  },
  {
    id: 'rw-eoi-025', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Lidar surveys of the Guatemalan lowlands were conducted from aircraft.
• The surveys penetrated dense forest canopy.
• They revealed more than 60,000 previously unrecorded Maya structures.
• Findings included causeways, terraces, and defensive earthworks.
• Population estimates for the Classic Maya were revised sharply upward.`,
    prompt: 'The student wants to explain how a technological method changed scholarly understanding of Maya society. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Lidar surveys of the Guatemalan lowlands were conducted from aircraft and penetrated dense forest canopy.',
      'Population estimates for the Classic Maya have been revised sharply upward in recent years.',
      'By penetrating forest canopy from the air, lidar revealed more than 60,000 unrecorded Maya structures, prompting a sharp upward revision of Classic Maya population estimates.',
      'Causeways, terraces, and defensive earthworks were among the structures revealed by lidar surveys.',
    ],
    answer: 2,
    explanation: 'The goal has a method and a consequence. Choice C carries lidar’s distinctive capability, the scale of what it found, and the revision in understanding that followed.',
    trap: 'Choice A describes the method well but stops before any change in understanding.',
  },
  {
    id: 'rw-eoi-026', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `Legal scholars have generally treated the doctrine as a nineteenth-century innovation. Citations in early state supreme court opinions do point overwhelmingly to sources from that period. Those opinions, ______ , were themselves drawing on a colonial-era treatise that the courts did not cite by name, and which set out the doctrine in nearly its modern form.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for instance', 'in fact', 'accordingly', 'similarly'],
    answer: 1,
    explanation: 'The sentence corrects the impression the citation pattern creates, revealing an older uncited source. "In fact" introduces that corrective.',
    trap: '"Accordingly" would make the colonial treatise a consequence of the citation pattern rather than the fact it obscures.',
  },
  {
    id: 'rw-eoi-027', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `The instrument's sensitivity is limited by thermal noise in its mirrors. Cooling the mirrors reduces that noise but introduces mechanical stress at the mounting points. The design team therefore faces a constraint that cannot be optimized away; ______ any gain in one noise source is purchased with a loss in another.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['that is,', 'even so,', 'in contrast,', 'afterward,'],
    answer: 0,
    explanation: 'The final clause spells out what the constraint amounts to. "That is" signals restatement in more concrete terms.',
    trap: '"Even so" would concede something, but the clause elaborates the constraint rather than pushing against it.',
  },
  {
    id: 'rw-eoi-028', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Wangari Maathai founded the Green Belt Movement in Kenya in 1977.
• The movement paid rural women to plant tree seedlings.
• More than 50 million trees have been planted.
• Maathai argued that deforestation and political disenfranchisement were connected.
• She received the Nobel Peace Prize in 2004, the first African woman to do so.`,
    prompt: 'The student wants to explain why Maathai’s environmental work was recognized with a peace prize rather than a scientific one. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Wangari Maathai founded the Green Belt Movement in Kenya in 1977, and more than 50 million trees have been planted.',
      'Maathai received the Nobel Peace Prize in 2004, becoming the first African woman to do so.',
      'Because Maathai argued that deforestation and political disenfranchisement were linked, her Green Belt Movement — which paid rural women to plant more than 50 million trees — was as much a political project as an ecological one.',
      'The Green Belt Movement paid rural women to plant tree seedlings, and more than 50 million trees have been planted.',
    ],
    answer: 2,
    explanation: 'The goal asks why a *peace* prize. Only choice C supplies the political dimension — the link Maathai drew and the empowerment of rural women — that makes the category make sense.',
    trap: 'Choice B reports the prize itself but offers no reason for the category.',
  },
  {
    id: 'rw-eoi-029', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions',
    difficulty: 3, type: 'mc',
    passage: `Advocates of the new assessment argue that it measures reasoning rather than recall. Independent analysis found that scores correlate at 0.81 with the older recall-based test it was designed to replace. A correlation of that magnitude does not by itself prove the two instruments measure the same construct; ______ it sets a high bar for the claim that they measure different ones.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['likewise,', 'in short,', 'still,', 'therefore,'],
    answer: 2,
    explanation: 'The clause concedes the limit of the correlation and then pushes back within that limit. "Still" carries that "granted, but nevertheless" turn.',
    trap: '"Therefore" would make the second clause follow from the first, but the first denies proof while the second reasserts pressure.',
  },
  {
    id: 'rw-eoi-030', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis',
    difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Dead Sea's surface level is dropping about a meter per year.
• Most inflow from the Jordan River is diverted upstream for agriculture and drinking water.
• Mineral extraction plants evaporate additional water.
• As the sea recedes, underground salt layers dissolve and sinkholes form.
• More than 6,000 sinkholes have appeared along the shoreline.`,
    prompt: 'The student wants to present the sinkholes as a downstream consequence of human water use. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'More than 6,000 sinkholes have appeared along the Dead Sea shoreline in recent decades.',
      'Because upstream diversion and mineral extraction have dropped the Dead Sea about a meter a year, exposed salt layers dissolve and collapse, producing more than 6,000 shoreline sinkholes.',
      'The Dead Sea’s surface level is dropping about a meter per year, and mineral extraction plants evaporate additional water.',
      'Underground salt layers dissolve as the Dead Sea recedes, and sinkholes form along the shoreline.',
    ],
    answer: 1,
    explanation: 'A downstream consequence needs the full chain: human diversion and extraction → falling level → dissolving salt → sinkholes. Choice B is the only option that runs it end to end.',
    trap: 'Choice D gives the physical mechanism but omits the human cause, which is the point of the stated goal.',
  },
]
