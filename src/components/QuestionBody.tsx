import type { Question } from '../data/types'

const LETTERS = ['A', 'B', 'C', 'D']

/** Renders a question's stimulus, prompt, and answer input. Shared by the
 *  lesson and the review screen so a question always looks the same. */
export const QuestionBody = ({
  q,
  choice,
  typed,
  locked,
  correctIndex,
  onChoose,
  onType,
  revealCorrect = false,
}: {
  q: Question
  choice: number | null
  typed: string
  locked: boolean
  correctIndex?: number
  onChoose: (i: number) => void
  onType: (s: string) => void
  /** In review, mark the right answer green even when nothing was selected. */
  revealCorrect?: boolean
}) => (
  <>
    {q.passage && (
      <div className="mb-4 whitespace-pre-line rounded-2xl border-2 border-swan bg-polar p-4 text-[15.5px] font-semibold leading-relaxed text-eel">
        {q.passage}
      </div>
    )}

    {q.table && (
      <div className="mb-4 overflow-x-auto rounded-2xl border-2 border-swan">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {q.table.headers.map((h, i) => (
                <th
                  key={i}
                  className="border-b-2 border-swan bg-polar px-3 py-2 text-left font-extrabold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border-b border-swan px-3 py-2 font-bold last:border-b-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <p className="mb-4 text-[18px] font-extrabold leading-snug">{q.prompt}</p>

    {q.type === 'mc' ? (
      <div className="flex flex-col gap-3">
        {q.choices?.map((c, i) => {
          const isChosen = choice === i
          const isRight = correctIndex === i
          let cls = ''
          if (locked || revealCorrect) {
            if (isRight) cls = 'choice-correct'
            else if (isChosen) cls = 'choice-wrong'
          } else if (isChosen) cls = 'choice-selected'

          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => onChoose(i)}
              className={`choice ${cls}`}
            >
              <span className="keycap">{LETTERS[i]}</span>
              <span className="flex-1">{c}</span>
            </button>
          )
        })}
      </div>
    ) : (
      <div>
        <input
          value={typed}
          disabled={locked}
          onChange={(e) => onType(e.target.value)}
          inputMode="text"
          autoComplete="off"
          placeholder="Type your answer"
          className={`w-full rounded-2xl border-2 border-b-4 px-4 py-4 text-center text-[22px] font-extrabold outline-none placeholder:text-[16px] placeholder:font-bold placeholder:text-hare ${
            locked ? 'border-swan bg-polar text-hare' : 'border-swan bg-white focus:border-macaw'
          }`}
        />
        <p className="mt-2 text-center text-[12.5px] font-bold text-hare">
          Fractions and decimals both work — 3/4 or 0.75.
        </p>
      </div>
    )}
  </>
)
