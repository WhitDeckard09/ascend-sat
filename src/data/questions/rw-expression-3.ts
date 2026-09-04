import type { Question } from '../types'

/** Expression of Ideas, third bank. */
export const expressionOfIdeas3: Question[] = [
  { id: 'rw-eoi3-001', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Pumice is the only rock that floats. ______ after an underwater eruption, rafts of it can drift for thousands of kilometres, carrying barnacles and coral larvae to islands they could not otherwise reach.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'For this reason,', 'In contrast,', 'Beforehand,'], answer: 1,
    explanation: 'The drifting rafts follow directly from the fact that pumice floats.', trap: 'A contrast marker breaks a straightforwardly causal link.' },
  { id: 'rw-eoi3-002', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Most spiders build a new web each night and eat the old one to recover the protein. ______ the bolas spider builds no web at all, swinging a single silk line with a sticky bead at the end.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Likewise,', 'By contrast,', 'Therefore,', 'In addition,'], answer: 1,
    explanation: 'The bolas spider departs from the pattern just described, so the sentence needs a contrast.', trap: '"Likewise" would claim the two behaviours match.' },
  { id: 'rw-eoi3-003', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `The library has substantially improved access to its manuscript collection. ______ it has digitized 12,000 folios and dropped its reader-registration fee.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Specifically,', 'Instead,', 'Regardless,', 'Conversely,'], answer: 0,
    explanation: 'The second sentence gives the particulars behind the general claim.', trap: '"Regardless" would dismiss the first sentence rather than support it.' },
  { id: 'rw-eoi3-004', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Aluminium is the most abundant metal in the Earth's crust. ______ it was so hard to separate from its ore that in the 1850s it cost more per ounce than gold.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Accordingly,', 'Yet', 'Likewise,', 'In addition,'], answer: 1,
    explanation: 'Abundance and extreme cost are surprising together, and "Yet" marks that tension.', trap: '"Accordingly" would make the high price follow from the abundance.' },
  { id: 'rw-eoi3-005', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Planners expected the new station to draw riders away from the two older ones nearby. ______ ridership at all three rose in the year after it opened.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['In fact,', 'For example,', 'Furthermore,', 'As a result,'], answer: 0,
    explanation: 'The outcome contradicts the expectation, and "In fact" introduces the corrective reality.', trap: '"As a result" would make the rise a consequence of the expectation.' },
  { id: 'rw-eoi3-006', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Hummingbirds are often described as hovering effortlessly. ______ sustaining a hover costs more energy per gram than almost any other vertebrate activity, and the birds must feed every ten to fifteen minutes to keep it up.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Consequently,', 'In reality,', 'Similarly,', 'Meanwhile,'], answer: 1,
    explanation: 'The second sentence corrects the impression the first reports.', trap: '"Meanwhile" suggests simultaneity rather than correction.' },
  { id: 'rw-eoi3-007', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Adding parking to a city centre is intended to relieve congestion by reducing the time drivers spend searching for a space. Cheap, plentiful parking also makes driving into the centre more attractive than it was; ______ the additional traffic can exceed the searching traffic the parking eliminated.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nonetheless,', 'by contrast,', 'as a result,', 'admittedly,'], answer: 2,
    explanation: 'The extra attractiveness is the cause and the additional traffic is its effect.', trap: '"Nonetheless" would suggest the traffic rose despite the attractiveness, when it rose because of it.' },
  { id: 'rw-eoi3-008', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The reconstruction matched the surviving foundations at every point. It relied, ______ , on a floor plan drawn forty years after the building was demolished by someone who had never entered it.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['therefore', 'however', 'moreover', 'likewise'], answer: 1,
    explanation: 'The second sentence undercuts the confidence the first invites.', trap: '"Moreover" would add a point in the same direction, but this one cuts against it.' },
  { id: 'rw-eoi3-009', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Most fungi obtain carbon by decomposing dead material. Certain orchid-associated species, ______ , run the exchange in reverse, supplying carbon to a plant that produces none of its own.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for example', 'in other words', 'though', 'consequently'], answer: 2,
    explanation: 'These fungi depart from the norm just stated, and "though" as an interrupter carries the contrast.', trap: '"For example" would present them as instances of ordinary decomposers.' },
  { id: 'rw-eoi3-010', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The pigment analysis places the panel in a Florentine workshop. The wood, ______ , comes from a Baltic oak whose growth rings match timber used almost exclusively in northern Europe.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['likewise', 'on the other hand', 'as a result', 'in short'], answer: 1,
    explanation: 'Two lines of physical evidence point to different origins, so the transition must mark the opposition.', trap: '"Likewise" would claim the wood agrees with the pigment.' },
  { id: 'rw-eoi3-011', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Critics predicted the fee would empty the city centre of shops. Retail occupancy inside the zone rose four percentage points over the following two years. ______ critics have argued that the surviving shops serve a narrower range of customers than before.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Accordingly,', 'In response,', 'Similarly,', 'For instance,'], answer: 1,
    explanation: 'The critics are reacting to evidence that contradicts their prediction.', trap: '"Accordingly" would make the new claim follow from the occupancy figures rather than push against them.' },
  { id: 'rw-eoi3-012', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The ceramic holds its strength above 1,400 °C and does not react with molten metal. It is, ______ , brittle enough that a single thermal shock can shatter a component, which has kept it out of applications where cycling is unavoidable.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['in addition', 'for instance', 'however', 'thus'], answer: 2,
    explanation: 'The first sentence lists advantages and the second introduces the limiting drawback.', trap: '"In addition" would file the brittleness alongside the advantages.' },
  { id: 'rw-eoi3-013', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Tree rings in the region record not annual rainfall but the depth of the previous winter's snowpack, since the trees draw almost entirely on meltwater. ______ a wide ring means a deep snow year rather than a wet summer.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'In other words,', 'By comparison,', 'Previously,'], answer: 1,
    explanation: 'The second sentence restates the implication of the first in plainer terms.', trap: '"Nevertheless" implies contrast, but the sentences agree entirely.' },
  { id: 'rw-eoi3-014', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `The survey recorded no fortification, no weapon caches, and no burials showing blunt-force injury. The community was not, ______ , necessarily without conflict; the excavated area covers less than two percent of the settlement, and no cemetery has been located at all.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for that reason', 'in particular', 'by comparison', 'as expected'], answer: 0,
    explanation: 'The sentence blocks an inference drawn from the evidence just given: not peaceful *for that reason*.', trap: '"In particular" would narrow the previous statement rather than deny what follows from it.' },
  { id: 'rw-eoi3-015', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `The index is built from the prices of goods a household actually bought. When a good becomes expensive, households buy less of it and more of something else, and the index reweights accordingly. Because substitution is itself a response to rising prices, an index that follows purchases ______ understates the loss a household experiences.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nevertheless', 'systematically', 'occasionally', 'conversely'], answer: 1,
    explanation: 'The bias arises from the method itself, so it occurs every time rather than sometimes or in spite of something.', trap: '"Occasionally" understates a bias the passage shows is built into the design.' },
  { id: 'rw-eoi3-016', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Reviewers judge grant proposals partly on feasibility, which favours projects whose outcome can be foreseen. A proposal whose result is genuinely uncertain scores poorly on that criterion by definition. ______ the selection process is best understood as rewarding not the most promising research but the most predictable.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Granted,', 'On this view,', 'In contrast,', 'Afterward,'], answer: 1,
    explanation: '"On this view" marks the conclusion that follows once the preceding reasoning is accepted.', trap: '"Granted" would concede to an opposing position, but the sentence completes the author’s argument.' },
  { id: 'rw-eoi3-017', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Sponges filter enormous volumes of water and expel the indigestible fraction as fine particles. Those particles are eaten by snails and worms on the reef floor. ______ the sponge converts material no reef animal could use directly into food that many of them can.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['In effect,', 'Even so,', 'By contrast,', 'Formerly,'], answer: 0,
    explanation: '"In effect" summarizes what the two-step process amounts to.', trap: 'A contrast marker breaks a chain that runs consistently in one direction.' },
  { id: 'rw-eoi3-018', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Restoring a river's meanders slows the water and reduces flood peaks downstream. The same works raise the water table in the surrounding fields, which some landowners regard as a loss of usable ground. ______ schemes that succeed hydrologically can still fail politically.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Consequently,', 'Similarly,', 'Nonetheless,', 'For example,'], answer: 0,
    explanation: 'The political failure follows from the conflict between the hydrological benefit and the landowners’ loss.', trap: '"Nonetheless" would concede against a point the passage is building toward.' },
  { id: 'rw-eoi3-019', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 1, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Mary Anning collected fossils on the Dorset coast from childhood.
• She found the first correctly identified ichthyosaur skeleton in 1811.
• She later found the first two plesiosaur skeletons.
• As a woman she could not join the Geological Society of London.
• Papers describing her finds were published under other researchers' names.`,
    prompt: 'The student wants to emphasize the gap between Anning’s discoveries and her standing in the scientific community. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Mary Anning collected fossils on the Dorset coast from childhood onward.',
      'Anning found the first correctly identified ichthyosaur and the first two plesiosaur skeletons, yet she could not join the Geological Society and the papers describing her finds carried other names.',
      'Anning found the first correctly identified ichthyosaur skeleton in 1811.',
      'Papers describing Anning’s discoveries were published under other researchers’ names.'],
    answer: 1,
    explanation: 'A gap needs both halves — the discoveries and the exclusion — joined in one sentence.', trap: 'Choices C and D each give one side, and a gap cannot be shown with one side alone.' },
  { id: 'rw-eoi3-020', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 1, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Norway's Svalbard Global Seed Vault opened in 2008.
• It stores duplicate samples of seeds held in gene banks worldwide.
• It is built into permafrost 130 metres inside a mountain.
• The chamber would stay below freezing for weeks without power.
• Syria's national gene bank withdrew samples in 2015 after its facility was damaged.`,
    prompt: 'The student wants to explain the vault’s purpose with an example of it being used. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Svalbard vault is built into permafrost 130 metres inside a mountain and opened in 2008.',
      'The vault holds duplicate seed samples from gene banks worldwide, and in 2015 Syria drew on its deposit after its own facility was damaged.',
      'The vault’s chamber would stay below freezing for weeks even without power.',
      'Norway opened the Svalbard Global Seed Vault in 2008 to store seeds from around the world.'],
    answer: 1,
    explanation: 'The goal asks for purpose plus a case of use, and only choice B supplies both.', trap: 'Choice D states the purpose but offers no example of the vault actually serving it.' },
  { id: 'rw-eoi3-021', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Eunice Newton Foote presented a paper at a scientific meeting in 1856.
• She had filled glass cylinders with different gases and left them in sunlight.
• The cylinder of carbon dioxide heated most and cooled most slowly.
• She wrote that such an atmosphere would give the earth a higher temperature.
• John Tyndall's better-known experiments were published three years later.`,
    prompt: 'The student wants to establish the priority of Foote’s finding. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Eunice Newton Foote filled glass cylinders with different gases and left them in sunlight.',
      'Foote reported in 1856 that an atmosphere of carbon dioxide would give the earth a higher temperature — three years before Tyndall’s better-known experiments appeared.',
      'The cylinder containing carbon dioxide heated most and cooled most slowly.',
      'John Tyndall published his experiments on atmospheric gases in 1859.'],
    answer: 1,
    explanation: 'Priority requires her conclusion and its date set against the better-known later work.', trap: 'Choice C reports the observation but not the claim she drew from it or when.' },
  { id: 'rw-eoi3-022', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Grand Banks cod fishery was closed by moratorium in 1992.
• Stock health had been judged from commercial catch rates.
• Sonar let boats find the remaining dense schools efficiently.
• Catch rates stayed high while total biomass collapsed.
• About 30,000 people lost their livelihoods when the fishery closed.`,
    prompt: 'The student wants to explain why the collapse was not detected in advance. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Grand Banks cod fishery was closed by moratorium in 1992, costing about 30,000 livelihoods.',
      'Because managers judged stock health from catch rates, and sonar let boats keep filling their holds from the last dense schools, the numbers stayed high while the stock disappeared.',
      'Sonar allowed fishing boats to locate the remaining dense schools of cod efficiently.',
      'About 30,000 people lost their livelihoods when the Grand Banks fishery closed in 1992.'],
    answer: 1,
    explanation: 'The failure to detect follows from the metric plus the technology that kept it flat, which only choice B connects.', trap: 'Choice C names the technology but not why it defeated the monitoring.' },
  { id: 'rw-eoi3-023', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Lead was added to petrol from the 1920s to stop engine knocking.
• Clair Patterson needed uncontaminated samples to date the earth's age.
• He found lead contamination in every laboratory he worked in.
• Tracing the source led him to atmospheric lead from petrol.
• His measurements underpinned the phase-out of leaded fuel.`,
    prompt: 'The student wants to emphasize that Patterson’s public-health contribution arose from an unrelated line of research. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Clair Patterson’s measurements underpinned the eventual phase-out of leaded petrol.',
      'Lead was added to petrol from the 1920s onward to stop engine knocking.',
      'Patterson set out to date the earth, and the contamination that kept spoiling his samples led him to atmospheric lead from petrol and, eventually, to its phase-out.',
      'Patterson found lead contamination in every laboratory in which he worked.'],
    answer: 2,
    explanation: 'The goal requires the original aim, the obstacle, and where it led — the full accidental chain.', trap: 'Choice A states the outcome without the geochemistry that produced it.' },
  { id: 'rw-eoi3-024', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Chinampas are raised planting beds built in shallow lake water.
• They were constructed by piling lake mud onto staked wicker frames.
• Canals between the beds provided water and transport.
• Mud dredged from the canals renewed the beds' fertility each year.
• Some chinampas near Xochimilco have been cultivated continuously for centuries.`,
    prompt: 'The student wants to explain why the system remained productive without external inputs. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Chinampas are raised planting beds built by piling lake mud onto staked wicker frames.',
      'Canals between the chinampas supplied both water and a transport route.',
      'Dredging the canals each year returned nutrient-rich mud to the beds, so the system renewed its own fertility — some plots near Xochimilco have been farmed for centuries.',
      'Some chinampas near Xochimilco have been cultivated continuously for centuries.'],
    answer: 2,
    explanation: 'Self-renewing fertility is the mechanism the goal asks about, and choice C supplies it plus the evidence of longevity.', trap: 'Choice D reports the longevity without explaining what sustained it.' },
  { id: 'rw-eoi3-025', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Lascaux caves were opened to visitors in 1948.
• Within a decade, algae and calcite were growing on the painted walls.
• Carbon dioxide and moisture from visitors had altered the cave's climate.
• The caves were closed to the public in 1963.
• A full-scale replica opened nearby in 1983.`,
    prompt: 'The student wants to explain why the caves were closed. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Lascaux caves were opened to visitors in 1948 and closed in 1963.',
      'A full-scale replica of the caves opened nearby in 1983.',
      'Carbon dioxide and moisture from visitors altered the cave’s climate enough to grow algae and calcite on the paintings, and the caves were closed in 1963.',
      'Algae and calcite began growing on the painted walls within a decade of the caves opening.'],
    answer: 2,
    explanation: 'The closure needs its cause: visitor-driven climate change inside the cave damaging the paintings.', trap: 'Choice D names the damage but not what produced it or what followed.' },
  { id: 'rw-eoi3-026', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Ada Blackjack joined a 1921 Arctic expedition as a seamstress.
• She had no wilderness training before the voyage.
• The four men on the expedition died or disappeared.
• She survived alone on Wrangel Island for two years, trapping foxes and shooting seals.
• She was rescued in 1923.`,
    prompt: 'The student wants to emphasize how unprepared Blackjack was for what she ended up doing. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Ada Blackjack was rescued from Wrangel Island in 1923 after two years alone.',
      'Blackjack joined the 1921 expedition as a seamstress with no wilderness training, and after the four men died or disappeared she survived two years alone by trapping foxes and shooting seals.',
      'The four men on the 1921 Arctic expedition died or disappeared.',
      'Blackjack survived alone on Wrangel Island for two years before being rescued.'],
    answer: 1,
    explanation: 'The contrast between her role and lack of training on one side and what she actually did on the other is what the goal asks for.', trap: 'Choice D reports the survival but omits the inexperience that makes it remarkable.' },
]
