        # Reproducibility — gunnchOS3k MLV Arcade

        ## Clone / setup / run

        ```bash
        git clone https://github.com/gunnchOS3k/{name}.git
cd gunnchOS3k-MLV-Arcade
npm ci
npm test
# Expected: CI smoke pass; tests pass or documented skip
        ```

        ## Expected outputs

        - Required documentation files present (`python3 scripts/check_required_files.py`)
        - Tests pass **or** documented smoke-only path for docs-only repos
        - No claim of field deployment from synthetic outputs alone

        ## Tool versions

        | Tool | Version guidance |
        |------|------------------|
        | Python | 3.10+ where `requirements.txt` exists |
        | Node | 18+ LTS where `package.json` exists |
        | Make | GNU Make where `Makefile` exists |

        Record exact versions in PR / release notes when publishing.

        ## Fresh machine checklist

        - [ ] Clone repo
        - [ ] Create clean venv / `npm ci`
        - [ ] Run `scripts/check_required_files.py`
        - [ ] Run test command from README
        - [ ] Compare outputs to `results/` or CI logs
        - [ ] Log environment in `reproducibility/FRESH_MACHINE_LOG.md` (optional)

        ## Evidence discipline

        **Real today:** Monorepo apps, shared bot-core, web assets

        **Synthetic / demo-only:** Demo deployments

        **Planned:** Store-ready builds

        **Not claimed:** Finished commercial console product
