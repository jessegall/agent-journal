<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A skill command run from the command line with no journal owner to act as.
 */
final class SkillPreviewRefused extends RuntimeException {}
