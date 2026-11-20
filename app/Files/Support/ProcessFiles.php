<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Contracts\Files;
use Illuminate\Container\Container;

/**
 * The application's one Files, for static boot code that runs before anything is injected into it; it is the same
 * instance the container hands every class that asks for Files.
 */
final class ProcessFiles
{
    public static function instance(): Files
    {
        return Container::getInstance()->make(Files::class);
    }
}
