<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * A page, navigation or section declaration the application refuses to start with.
 */
abstract class ClientDeclarationError extends RuntimeException {}
