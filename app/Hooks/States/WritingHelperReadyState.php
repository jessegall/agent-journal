<?php

declare(strict_types=1);

namespace App\Hooks\States;

/**
 * The bottom state of a writing helper: the helper rules hold, and it may change files in its own worktree.
 */
class WritingHelperReadyState extends HelperReadyState {}
