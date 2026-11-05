# Advanced anatomy coverage

The four body maps use SVG paths from [react-muscle-highlighter](https://github.com/soroojshehryar/react-muscle-highlighter), commit `981291ca88a8d27205adc7532ebb2416b7e4609f`, under MIT. The source contours, hands, feet, heads, hair and view boxes are retained. See [the third-party notice](../THIRD_PARTY_NOTICES.md).

Muscle-graph retains its 32 detailed muscle IDs. Separate source paths are mapped directly. Complementary clipping masks subdivide combined chest, biceps, male anterior deltoid, posterior deltoid and posterior trapezius paths without changing their outer contours. Fine-region assignments are adaptations for exercise selection. Some source upper-back and thigh paths span adjacent surface structures within their broader selection group.

Both body options have the following detailed coverage.

| Muscle category / ID | Anterior | Posterior |
| --- | :---: | :---: |
| Upper trapezius · `upper-trapezius` | Yes | Yes |
| Middle trapezius · `middle-trapezius` | — | Yes |
| Lower trapezius · `lower-trapezius` | — | Yes |
| Latissimus dorsi · `lats` | — | Yes |
| Lower back · `lower-back` | — | Yes |
| Upper pectoralis · `upper-pectoralis` | Yes | — |
| Mid/lower pectoralis · `mid-lower-pectoralis` | Yes | — |
| Anterior deltoid · `anterior-deltoid` | Yes | — |
| Lateral deltoid · `lateral-deltoid` | Yes | Yes |
| Posterior deltoid · `posterior-deltoid` | — | Yes |
| Biceps, long head · `long-head-bicep` | Yes | — |
| Biceps, short head · `short-head-bicep` | Yes | — |
| Triceps, long head · `long-head-triceps` | Yes | Yes |
| Triceps, lateral head · `lateral-head-triceps` | — | Yes |
| Triceps, medial head · `medial-head-triceps` | — | Yes |
| Wrist flexors · `wrist-flexors` | Yes | Yes |
| Wrist extensors · `wrist-extensors` | Yes | Yes |
| Upper abdominals · `upper-abdominals` | Yes | — |
| Lower abdominals · `lower-abdominals` | Yes | — |
| Obliques · `obliques` | Yes | — |
| Vastus lateralis · `outer-quadricep` | Yes | — |
| Rectus femoris · `rectus-femoris` | Yes | — |
| Vastus medialis · `inner-quadricep` | Yes | — |
| Adductors · `inner-thigh` | Yes | Yes |
| Medial hamstrings · `medial-hamstrings` | — | Yes |
| Lateral hamstrings · `lateral-hamstrings` | — | Yes |
| Gluteus maximus · `gluteus-maximus` | — | Yes |
| Gluteus medius · `gluteus-medius` | — | Yes |
| Gastrocnemius, lateral head · `gastrocnemius-lateral-head` | — | Yes |
| Gastrocnemius, medial head · `gastrocnemius-medial-head` | Yes | Yes |
| Tibialis anterior · `tibialis` | Yes | — |
| Soleus · `soleus` | Yes | Yes |

Hands, feet, head, neck, knees, ankles and hair are supplementary selectable areas outside the 32-region list. Their availability follows the original SVG assets. Each rear calf has independently selectable medial and lateral gastrocnemius regions and a separate soleus group. The original broad exercise names and nested calf inputs continue to work.

## Geometry and rendering

The upstream view boxes are `0 0 724 1448` for male anterior, `724 0 724 1448` for male posterior, `-50 -40 734 1538` for female anterior and `756 0 774 1448` for female posterior. Responsive SVG scaling preserves their aspect ratios.

Female rendering applies a uniform figure fit to match the male crown and sole positions. The female head and hair share a 20% scale reduction anchored at the lower head. The corresponding upper border receives the same transformation. SVG transforms keep the rendered artwork and its pointer targets aligned.

Male feet reuse the female foot contours in both views, translated to the male ankle attachments and ground line. Their borders use the matching female contour sections. The posterior ankle regions end where the adapted heels begin.

The source path strings remain unchanged in `src/anatomy`. Selection masks only add internal divisions. The renderer creates unique clip identifiers for every model instance, so multiple maps can share the same page. The package includes no React dependency.
