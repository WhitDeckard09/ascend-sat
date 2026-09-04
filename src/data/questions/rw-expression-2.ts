import type { Question } from '../types'

/** Expression of Ideas, second bank: transitions and rhetorical synthesis. */
export const expressionOfIdeas2: Question[] = [
  { id: 'rw-eoi2-001', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Beavers fell trees and dam streams, flooding the land behind the dam. ______ a single colony can convert a fast-running creek into a wetland within two seasons.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'Consequently,', 'In contrast,', 'For instance,'], answer: 1,
    explanation: 'The second sentence states the effect of the behaviour described in the first.', trap: '"Nevertheless" would signal a contrast, but the sentences agree.' },
  { id: 'rw-eoi2-002', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Most amphibians lay eggs in water. ______ the Surinam toad carries its eggs embedded in the skin of its back until the young emerge fully formed.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Similarly,', 'Therefore,', 'However,', 'Moreover,'], answer: 2,
    explanation: 'The toad departs from the norm just stated, so the sentence needs a contrast marker.', trap: '"Similarly" would claim the two behaviours match.' },
  { id: 'rw-eoi2-003', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `The museum has expanded its holdings of West African textiles considerably. ______ it has acquired 340 pieces and opened a dedicated study room.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Specifically,', 'Instead,', 'Regardless,', 'Conversely,'], answer: 0,
    explanation: 'The second sentence supplies the figures behind the general claim.', trap: '"Regardless" would dismiss the first sentence rather than support it.' },
  { id: 'rw-eoi2-004', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Copper is abundant and easy to work, which is why it was among the first metals humans smelted. ______ pure copper is too soft for tools that must hold an edge.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Accordingly,', 'Yet', 'Likewise,', 'In addition,'], answer: 1,
    explanation: 'Abundance and unsuitability pull against each other, so the transition must mark that tension.', trap: '"Accordingly" would make the softness follow from the abundance.' },
  { id: 'rw-eoi2-005', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Researchers expected the treated soil to retain more water than the untreated plots. ______ after a full season the two groups held nearly identical amounts.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['In fact,', 'For example,', 'Furthermore,', 'As a result,'], answer: 0,
    explanation: 'The outcome contradicts the expectation, and "In fact" introduces the corrective reality.', trap: '"As a result" would make the null finding a consequence of the expectation.' },
  { id: 'rw-eoi2-006', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Lightning is often said to strike the tallest object in an area. ______ the discharge begins as a channel that branches downward and connects with whichever upward streamer reaches it first.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Consequently,', 'In reality,', 'Similarly,', 'Meanwhile,'], answer: 1,
    explanation: 'The second sentence replaces the popular account with the physical one.', trap: '"Meanwhile" suggests simultaneity rather than correction.' },
  { id: 'rw-eoi2-007', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Sea otters eat sea urchins in enormous quantities. Urchins graze on kelp. ______ a healthy otter population usually means a dense kelp forest.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['However,', 'Thus,', 'By contrast,', 'Admittedly,'], answer: 1,
    explanation: 'The final sentence is the conclusion of the two-step chain that precedes it.', trap: 'A contrast marker breaks a chain that is entirely consistent.' },
  { id: 'rw-eoi2-008', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Widening a congested motorway usually shortens journey times only briefly. The improved conditions draw drivers who had used other routes or travelled at other hours; ______ congestion returns to close to its former level within a few years.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nonetheless,', 'by contrast,', 'as a result,', 'admittedly,'], answer: 2,
    explanation: 'The influx of drivers is the cause and the returning congestion is its effect.', trap: '"Nonetheless" would suggest congestion returned despite the influx, when it returned because of it.' },
  { id: 'rw-eoi2-009', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The model reproduced the observed migration timings closely. It did so, ______ , only after two parameters were set to values that field measurements do not support.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['therefore', 'however', 'moreover', 'likewise'], answer: 1,
    explanation: 'The second sentence undercuts the success reported in the first.', trap: '"Moreover" would add a point in the same direction, but this one cuts against it.' },
  { id: 'rw-eoi2-010', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Most lichens are a partnership between a fungus and an alga. Some species, ______ , involve a third partner, a yeast embedded in the outer layer, whose role went unnoticed for over a century.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for example', 'in other words', 'though', 'consequently'], answer: 2,
    explanation: 'These species depart from the two-partner norm just stated, and "though" as an interrupter carries that contrast.', trap: '"For example" would present them as instances of the two-partner pattern.' },
  { id: 'rw-eoi2-011', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The manuscript's ink contains carbon black, consistent with East Asian production. Its binding, ______ , uses a sewing structure documented only in Coptic workshops.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['likewise', 'on the other hand', 'as a result', 'in short'], answer: 1,
    explanation: 'Two pieces of physical evidence point toward different origins, so the transition must mark the opposition.', trap: '"Likewise" would claim the binding agrees with the ink.' },
  { id: 'rw-eoi2-012', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Opponents warned that the levy would push small producers out of the market. The number of registered small producers rose 6 percent over the next three years. ______ opponents have argued that the growth would have been larger without the levy.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Accordingly,', 'In response,', 'Similarly,', 'For instance,'], answer: 1,
    explanation: 'The opponents are reacting to evidence that contradicts their warning.', trap: '"Accordingly" would make the new claim follow logically from the growth, but it works against it.' },
  { id: 'rw-eoi2-013', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The alloy stays ductile at cryogenic temperatures and resists hydrogen embrittlement. It is, ______ , difficult enough to machine that its use is largely confined to components no substitute can serve.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['in addition', 'for instance', 'however', 'thus'], answer: 2,
    explanation: 'The first sentence lists advantages; the second introduces the drawback that limits use.', trap: '"In addition" would file the difficulty alongside the advantages.' },
  { id: 'rw-eoi2-014', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Antarctic ice cores hold air bubbles sealed at the moment the surrounding snow compacted. ______ each bubble is a direct sample of the atmosphere as it was when the layer formed.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'In other words,', 'By comparison,', 'Previously,'], answer: 1,
    explanation: 'The second sentence restates the implication of the first in plainer terms.', trap: '"Nevertheless" implies contrast, but the sentences agree completely.' },
  { id: 'rw-eoi2-015', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The restoration removed two centuries of varnish. ______ it left every loss and abrasion untouched, on the principle that a viewer should be able to see where the painting had been damaged.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['At the same time,', 'As a result,', 'For example,', 'In particular,'], answer: 0,
    explanation: 'Two things were done together, one of which limits the other, which "At the same time" signals.', trap: '"As a result" would make the untouched losses a consequence of removing varnish.' },
  { id: 'rw-eoi2-016', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Standard batteries lose capacity as they are cycled, because the electrode structure degrades. A new cell design lets the electrode reorganize between cycles. ______ its capacity after a thousand cycles is close to what it was at the start.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Even so,', 'Accordingly,', 'On the contrary,', 'Meanwhile,'], answer: 1,
    explanation: 'The retained capacity follows directly from the reorganizing electrode.', trap: '"Even so" would concede ground the passage never gives up.' },
  { id: 'rw-eoi2-017', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `The excavation produced no weapons, no defensive wall, and no skeletal injuries of the kind associated with raiding. The site's occupants were not, ______ , necessarily peaceful; wooden weapons leave no trace in this soil, and only nine burials have been recovered.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for that reason', 'in particular', 'by comparison', 'as expected'], answer: 0,
    explanation: 'The sentence blocks an inference drawn from the evidence just given: they were not peaceful *for that reason*.', trap: '"In particular" would narrow the previous statement rather than deny what follows from it.' },
  { id: 'rw-eoi2-018', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Advocates project that the aquifer can supply the district through 2060. That projection assumes recharge at the twentieth-century mean. Isotope studies indicate that the twentieth century was among the wettest periods the aquifer has seen in eight thousand years; ______ the baseline underlying the projection may itself be exceptional.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['nevertheless,', 'in other words,', 'for example,', 'previously,'], answer: 1,
    explanation: 'The final clause restates what the isotope finding implies for the projection.', trap: '"Nevertheless" implies contrast, but the clause agrees with and interprets what precedes it.' },
  { id: 'rw-eoi2-019', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Speech-recognition systems trained on read speech transcribe read speech almost perfectly. Given spontaneous conversation, with its false starts and overlaps, the same systems degrade sharply. ______ the failure is not a shortage of vocabulary but a mismatch between the distribution the model learned and the one it is asked to handle.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Critically,', 'Alternatively,', 'Afterward,', 'Granted,'], answer: 0,
    explanation: 'The last sentence identifies the essential point about the preceding example, so an emphasis marker fits.', trap: '"Granted" concedes to an opposing view, but this sentence sharpens the author’s own analysis.' },
  { id: 'rw-eoi2-020', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Legal historians have generally treated the doctrine as a nineteenth-century development. Citations in early appellate opinions do point almost entirely to sources from that period. Those opinions, ______ , were drawing on an eighteenth-century treatise that the courts never named, and which stated the doctrine in nearly its modern form.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for instance', 'in fact', 'accordingly', 'similarly'], answer: 1,
    explanation: 'The sentence corrects the impression the citation pattern creates by revealing an older uncited source.', trap: '"Accordingly" would make the treatise a consequence of the citation pattern rather than the fact it hides.' },
  { id: 'rw-eoi2-021', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `The detector's sensitivity is limited by thermal motion in its test masses. Cooling the masses suppresses that motion but introduces stress at the suspension points. The design therefore faces a constraint that cannot be engineered away; ______ any reduction in one noise source is paid for with an increase in another.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['that is,', 'even so,', 'in contrast,', 'afterward,'], answer: 0,
    explanation: 'The final clause spells out what the constraint amounts to in concrete terms.', trap: '"Even so" would concede something, but the clause elaborates rather than pushes back.' },
  { id: 'rw-eoi2-022', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Supporters of the new assessment argue that it measures reasoning rather than memorization. An independent analysis found that its scores correlate at 0.84 with the memorization-based test it replaced. A correlation that high does not by itself establish that the two instruments measure the same thing; ______ it places a considerable burden on anyone claiming they measure different things.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['likewise,', 'in short,', 'still,', 'therefore,'], answer: 2,
    explanation: 'The clause concedes the limit of the correlation and then pushes back within that limit, which is the "granted, but nevertheless" turn.', trap: '"Therefore" would make the second clause follow from the first, but the first denies proof while the second reasserts pressure.' },
  { id: 'rw-eoi2-023', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Museums have long dated the pigment by its chemical signature alone. Two synthetic versions of the mineral, produced in different centuries, share that signature exactly. Dating by chemistry, ______ , can place an object within a range of several hundred years at best.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['for example', 'then', 'instead', 'by comparison'], answer: 1,
    explanation: '"Then" draws the consequence of the preceding fact: because the signatures match, the method cannot discriminate finely.', trap: '"Instead" would substitute one method for another, but no alternative has been offered.' },
  { id: 'rw-eoi2-024', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Glass sponges build skeletons of interlocking silica spicules. The lattice is stiff enough to survive currents that flatten softer organisms. ______ some specimens on the deep shelf are estimated to be over ten thousand years old.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Indeed,', 'Otherwise,', 'In contrast,', 'Regardless,'], answer: 0,
    explanation: '"Indeed" intensifies the preceding claim with a striking supporting fact.', trap: '"In contrast" would set the age against the durability, but the age illustrates it.' },
  { id: 'rw-eoi2-025', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `The city removed a two-mile elevated motorway in 2003, and planners predicted severe congestion on the surrounding streets. Traffic volumes on those streets rose only slightly. ______ average journey times across the district fell.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Consequently,', 'More surprisingly,', 'By the same token,', 'Beforehand,'], answer: 1,
    explanation: 'The second finding is a further and stronger departure from what planners expected.', trap: '"Consequently" would make the falling times follow from the rising volumes, which is backwards.' },
  { id: 'rw-eoi2-026', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Saffron is harvested by hand from the stigmas of a crocus that flowers for two weeks a year. ______ it takes roughly 150,000 flowers to produce a single kilogram.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nevertheless,', 'For this reason,', 'In contrast,', 'Meanwhile,'], answer: 1,
    explanation: 'The quantity of flowers follows from the fact that only the stigmas are used.', trap: 'A contrast marker breaks a straightforwardly causal link.' },
  { id: 'rw-eoi2-027', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 1, type: 'mc',
    passage: `Bamboo is a grass and can be harvested every three to five years without replanting. Timber species used for the same purpose take decades to reach usable size. ______ builders interested in short replacement cycles have begun to specify it for structural work.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Even so,', 'Unsurprisingly,', 'On the other hand,', 'Formerly,'], answer: 1,
    explanation: 'The builders’ interest is the natural consequence of the contrast just drawn.', trap: '"Even so" would concede against a point the passage is building toward.' },
  { id: 'rw-eoi2-028', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Studies of pesticide effects on bees usually dose colonies under laboratory conditions. Field colonies encounter the same compounds intermittently and alongside a dozen others. ______ laboratory results may understate the risk that matters in practice.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Similarly,', 'For this reason,', 'Nonetheless,', 'In particular,'], answer: 1,
    explanation: 'The mismatch between laboratory and field conditions is the reason the results may understate the risk.', trap: '"Similarly" would claim the two conditions match, which is the opposite of the point.' },
  { id: 'rw-eoi2-029', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 3, type: 'mc',
    passage: `Every extant copy of the treatise descends from a single fifteenth-century exemplar, which contains an obvious scribal error in the third chapter. Editors have generally corrected the error silently. The correction, ______ , removes the only evidence that all surviving copies share one ancestor.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['moreover', 'however', 'accordingly', 'likewise'], answer: 1,
    explanation: 'The final sentence identifies a cost of the correction, cutting against the editors’ practice.', trap: '"Accordingly" would make the loss follow approvingly from the correction.' },
  { id: 'rw-eoi2-030', section: 'rw', domain: 'expression-of-ideas', skill: 'transitions', difficulty: 2, type: 'mc',
    passage: `Sourdough starters maintained in different kitchens develop different flavours. A study of starters from fourteen countries found that microbial makeup tracked the flour a baker used far more closely than the baker's location. ______ the "local character" bakers describe may be a property of their supplier rather than their air.`,
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Even so,', 'If so,', 'In contrast,', 'Beforehand,'], answer: 1,
    explanation: '"If so" carries the conditional consequence of the finding just reported.', trap: '"Even so" would concede against the finding rather than draw from it.' },

  // --------------------------------------------------------- rhetorical synthesis
  { id: 'rw-eoi2-031', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 1, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Fanny Bullock Workman was a mountaineer and geographer.
• Between 1899 and 1912 she led eight expeditions in the Karakoram.
• She set a women's altitude record of 22,810 feet in 1906.
• She surveyed and mapped several previously uncharted glaciers.`,
    prompt: 'The student wants to emphasize Workman’s contribution to geographic knowledge. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Fanny Bullock Workman set a women’s altitude record of 22,810 feet in 1906.',
      'Across eight Karakoram expeditions, Workman surveyed and mapped several glaciers that had never been charted.',
      'Fanny Bullock Workman was a mountaineer and geographer who led expeditions between 1899 and 1912.',
      'Workman led eight expeditions and set an altitude record that stood for years.'],
    answer: 1,
    explanation: 'Geographic knowledge means the surveying and mapping, which only choice B reports.', trap: 'The altitude record is an athletic achievement, not a contribution to knowledge.' },
  { id: 'rw-eoi2-032', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 1, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Vasa was a Swedish warship launched in 1628.
• It sank less than a nautical mile into its maiden voyage.
• The Baltic's low salinity prevented shipworm from destroying the hull.
• It was raised largely intact in 1961 and is now a museum.`,
    prompt: 'The student wants to explain why the ship survived to be recovered. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Vasa, a Swedish warship launched in 1628, sank on its maiden voyage.',
      'The Vasa was raised largely intact in 1961 and is now a museum.',
      'Because the Baltic’s low salinity keeps shipworm from attacking timber, the Vasa’s hull survived on the seabed and was raised largely intact in 1961.',
      'The Vasa sank less than a nautical mile into its maiden voyage in 1628.'],
    answer: 2,
    explanation: 'The goal asks for a cause of survival, which is the low salinity that kept shipworm away.', trap: 'Choices A, B and D state facts about the ship without explaining the preservation.' },
  { id: 'rw-eoi2-033', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Chien-Shiung Wu was an experimental physicist at Columbia.
• In 1956 two theorists asked her to test whether parity is conserved.
• Her experiment with cobalt-60 showed that it is not.
• The two theorists received the 1957 Nobel Prize; Wu did not.`,
    prompt: 'The student wants to emphasize the gap between Wu’s role and her recognition. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Chien-Shiung Wu was an experimental physicist at Columbia who worked with cobalt-60.',
      'Wu’s cobalt-60 experiment showed that parity is not conserved, but the 1957 Nobel Prize went to the two theorists who had asked her to run it.',
      'Two theorists asked Wu in 1956 to test whether parity is conserved.',
      'The 1957 Nobel Prize was awarded for the discovery that parity is not conserved.'],
    answer: 1,
    explanation: 'A gap needs both halves: the decisive experiment and the prize going elsewhere.', trap: 'Each of the other choices gives one side only, and a gap cannot be shown with one side.' },
  { id: 'rw-eoi2-034', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Aral Sea was the fourth-largest lake in the world in 1960.
• Two feeding rivers were diverted for cotton irrigation.
• By 2010 the lake had lost about 90 percent of its volume.
• Fishing towns are now stranded 60 miles from the water.
• Salt and pesticide dust from the exposed bed blows into nearby settlements.`,
    prompt: 'The student wants to present the shrinking of the lake as a consequence of a policy decision. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'By 2010 the Aral Sea had lost about 90 percent of the volume it held in 1960.',
      'Diverting the Aral Sea’s two feeding rivers for cotton irrigation cost the lake about 90 percent of its volume by 2010.',
      'Salt and pesticide dust from the exposed lakebed now blows into nearby settlements.',
      'Fishing towns that once sat on the Aral Sea are now stranded 60 miles from the water.'],
    answer: 1,
    explanation: 'The goal names a policy decision as the cause, so the sentence must connect the diversion to the loss.', trap: 'The other choices describe the consequences without naming the decision behind them.' },
  { id: 'rw-eoi2-035', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Alice Ball was a chemist at the College of Hawaii.
• In 1915 she developed an injectable form of chaulmoogra oil.
• It was the first effective treatment for leprosy.
• She died in 1916 at age 24 before publishing the method.
• A colleague published the technique under his own name.`,
    prompt: 'The student wants to explain why Ball’s contribution went unrecognized for decades. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Alice Ball developed the first effective treatment for leprosy in 1915.',
      'Ball died in 1916 before publishing her method, and a colleague then published the technique under his own name.',
      'Alice Ball was a chemist at the College of Hawaii who worked with chaulmoogra oil.',
      'The injectable form of chaulmoogra oil was the first effective leprosy treatment.'],
    answer: 1,
    explanation: 'The lack of recognition follows from her death before publication and the colleague’s appropriation.', trap: 'The other options describe the achievement itself, not why credit went elsewhere.' },
  { id: 'rw-eoi2-036', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 2, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Mangroves grow in the intertidal zone of tropical coasts.
• Their root systems trap sediment and slow water movement.
• A 100-metre band can reduce wave height by up to 66 percent.
• They store several times more carbon per hectare than tropical forest.
• About a third of global mangrove cover was lost between 1980 and 2000.`,
    prompt: 'The student wants to argue that mangrove loss carries costs beyond habitat. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Mangroves grow in the intertidal zone of tropical coasts, where their roots trap sediment.',
      'About a third of global mangrove cover was lost between 1980 and 2000.',
      'Losing mangroves removes both a coastal barrier that can cut wave height by up to 66 percent and a carbon store several times denser than tropical forest.',
      'A 100-metre band of mangroves can reduce wave height by up to 66 percent.'],
    answer: 2,
    explanation: 'Costs beyond habitat means the protective and carbon-storage functions, and only choice C frames both as losses.', trap: 'Choice D gives one function but does not present its loss as a cost.' },
  { id: 'rw-eoi2-037', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Henrietta Lacks was treated for cervical cancer in 1951.
• Cells taken from her tumour without her knowledge grew indefinitely in culture.
• The HeLa line became the most widely used human cell line in research.
• It was used to develop the polio vaccine and in tens of thousands of studies.
• Her family learned of the cells' existence only in 1973.`,
    prompt: 'The student wants to emphasize the disparity between the cells’ scientific value and the family’s position. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Cells taken from Henrietta Lacks in 1951 grew indefinitely in culture.',
      'The HeLa line was used to develop the polio vaccine and in tens of thousands of subsequent studies.',
      'Cells taken from Lacks without her knowledge became the most widely used human cell line in research, yet her family did not learn they existed until 1973.',
      'Henrietta Lacks was treated for cervical cancer in 1951, and her family learned of the cells in 1973.'],
    answer: 2,
    explanation: 'A disparity requires both the scale of scientific use and the family’s ignorance of it, joined in one sentence.', trap: 'Choice D pairs two facts but omits the scientific value that makes the disparity sharp.' },
  { id: 'rw-eoi2-038', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• The Antikythera mechanism was recovered from a shipwreck in 1901.
• It contains at least 30 interlocking bronze gears.
• It modelled the positions of the sun, moon, and planets.
• No comparable geared device is known for the next thousand years.
• Its purpose was not understood until X-ray imaging in the 1970s.`,
    prompt: 'The student wants to convey how anomalous the mechanism is in the history of technology. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'The Antikythera mechanism was recovered from a shipwreck in 1901 and studied by X-ray in the 1970s.',
      'The mechanism uses at least 30 interlocking bronze gears to model the positions of the sun, moon, and planets.',
      'The mechanism’s 30 interlocking gears modelled the sun, moon, and planets, and no comparable geared device appears anywhere for the next thousand years.',
      'X-ray imaging in the 1970s finally revealed what the Antikythera mechanism was for.'],
    answer: 2,
    explanation: 'Anomalous means out of step with its surroundings, which requires the thousand-year gap alongside the sophistication.', trap: 'Choice B establishes the sophistication but gives no context to make it anomalous.' },
  { id: 'rw-eoi2-039', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Ignaz Semmelweis worked in a Vienna maternity clinic in the 1840s.
• Two wards had very different rates of fatal infection.
• He noticed that doctors moved from dissections to deliveries without washing.
• Requiring handwashing in chlorinated lime cut deaths from 18% to about 2%.
• Colleagues rejected the finding; germ theory was still two decades away.`,
    prompt: 'The student wants to explain why a demonstrably effective intervention was rejected. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Requiring handwashing in chlorinated lime cut deaths in the ward from 18% to about 2%.',
      'Semmelweis noticed that doctors moved from dissections to deliveries without washing their hands.',
      'Semmelweis could show that handwashing cut deaths from 18% to about 2%, but he could not explain why, since germ theory was still two decades away.',
      'Two wards in the Vienna clinic had very different rates of fatal infection in the 1840s.'],
    answer: 2,
    explanation: 'The rejection is explained by the absence of a mechanism: the result was demonstrable but unexplainable at the time.', trap: 'Choice A gives the evidence but nothing about why colleagues dismissed it.' },
  { id: 'rw-eoi2-040', section: 'rw', domain: 'expression-of-ideas', skill: 'rhetorical-synthesis', difficulty: 3, type: 'mc',
    passage: `While researching a topic, a student has taken the following notes:

• Passenger pigeons numbered in the billions in the early 1800s.
• They nested in colonies covering hundreds of square miles.
• Breeding success depended on colony size overwhelming predators.
• Commercial hunting and telegraph-coordinated shipping reduced flocks quickly.
• The last individual died in 1914.`,
    prompt: 'The student wants to explain why the species collapsed rather than declining gradually. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Passenger pigeons numbered in the billions in the early 1800s, and the last one died in 1914.',
      'Because breeding success depended on enormous colonies overwhelming predators, hunting that thinned the flocks removed the very condition the birds needed to reproduce.',
      'Commercial hunting and telegraph-coordinated shipping reduced passenger pigeon flocks quickly.',
      'Passenger pigeons nested in colonies that covered hundreds of square miles.'],
    answer: 1,
    explanation: 'A collapse rather than a gradual decline needs the threshold effect: thinning the flock destroyed the mechanism reproduction depended on.', trap: 'Choice C names the pressure but not why its effect was non-linear.' },
]
