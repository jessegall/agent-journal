<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\SettingsResolver;
use Illuminate\Container\Container;

/**
 * Hands out the settings reader of the request or job running now. An object that outlives one request, such as a
 * state factory, keeps this instead of a reader, so each request reads its own settings.
 */
final readonly class CurrentSettingsResolver
{
    public function resolver(): SettingsResolver
    {
        return Container::getInstance()->make(SettingsResolver::class);
    }
}
