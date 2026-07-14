# Pull Request Description - Conflict Recovery

## What Was Broken
- **Raw Conflict Markers in Main (`9cd3194`)**: The merge commit `9cd3194` ("unstable merge of feature/discounts") was pushed to `main` containing raw Git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in `checkout.js`. This is a critical release risk as it introduces invalid JavaScript syntax, causing the application to crash at runtime (SyntaxError) in production.
- **WIP Commits with Unresolved Conflicts (`8842e07`)**: The commit `8842e07` on the `feature/discounts` branch, titled "fix conflicts partially - WIP", was committed with unresolved conflict markers. Merging this work-in-progress code without validation contaminated both the integration and main branches.
- **Duplicate History & Direct Commits on Main (`f1f84b1`)**: The floating-point rounding fix was committed directly to `main` under commit `f1f84b1`. However, the same change already existed in the branch `bugfix/rounding` as commit `0ad1a0e`. This direct push to `main` bypassed team review, duplicated commit history, and increased the potential for merge headaches.
- **Diverged Feature Branches (`feature/tax-v2`)**: The `feature/tax-v2` branch (pointing to `a40637f`) drifted from `main` without synchronization for weeks, creating code conflicts in the core checkout function.

## Recovery Actions Taken
1. **Branch Isolation**: Created the `recovery/main-fix` branch from the messy state of `main` to isolate recovery efforts.
2. **Reverting the Corrupted Merge**: Executed `git revert -m 1 9cd3194` (creating commit `5cd30ae`) to undo the messy merge. We chose `git revert` over `git reset` because `main` is a shared branch. If we had reset the history, we would have rewritten public commits, causing divergence and severe integration conflicts for other team members pulling the repository.
3. **Cherry-picking Good Commits**: Cherry-picked `712e5f2` (discount logic) from the `feature/discounts` branch. This allowed us to extract the clean, functional 10% discount logic while deliberately bypassing the messy WIP commit `8842e07`. During this process, we resolved the conflicts between the discount logic and the existing rounding fix to preserve both functionalities.
4. **Merging Drifting Branch**: Merged `feature/tax-v2` into `recovery/main-fix` to integrate the 5% sales tax calculation, resolving the resulting merge conflict in `checkout.js` manually.
5. **Adding Test Coverage**: Created `test.js` to validate that the discount, tax, and rounding pipeline behaves correctly.

## Conflict Resolution Decisions
- **File**: `checkout.js`
- **Function**: `checkout`
- **Description**: The conflict occurred because `feature/discounts` (adding 10% discount) and `feature/tax-v2` (adding 5% tax) both modified the same logic block, while `main` already had a floating-point rounding fix.
- **Resolution**: Both business requirements are valid and must co-exist. The final logic was resolved by ordering the pipeline as follows:
  1. Calculate the subtotal of the items list.
  2. Apply the 10% global discount (`total = total * 0.9`).
  3. Apply the 5% sales tax on the discounted subtotal (`total = total * 1.05`).
  4. Perform the floating-point rounding fix (`Math.round(total * 100) / 100`) and return the final rounded total.
This sequence ensures tax is calculated after discounts (standard commercial rule) and prevents floating-point inaccuracies.

## Repository State After Recovery
- The repository's `recovery/main-fix` branch is now in a stable, fully deployable state.
- All business logic in `checkout.js` is correct, clean, and verified by `test.js` (yielding `$9.45` for a `$10.00` item).
- The commit history on our recovery branch is clean, linear, and completely free of raw conflict markers.
- The remaining open branches (`feature/discounts`, `feature/tax-v2`, `bugfix/rounding`, `integration`) can be safely left open as they represent the development team's historical branches and do not affect the main production release path.
