<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

use RuntimeException;

/**
 * A domain declaration the application refuses to start with.
 */
abstract class DomainDeclarationError extends RuntimeException {}
