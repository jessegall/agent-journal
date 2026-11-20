<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use Closure;
use Illuminate\Database\Eloquent\Model;

/**
 * A timeout raised by the alarm can land while Eloquent boots a model. Eloquent clears a model's booting mark only
 * when its boot finishes, so an interrupted boot would refuse that model in every later test of the same process.
 */
final class InterruptedModelBoots
{
    public static function forget(): void
    {
        $clear = function (): void {
            static::$booting = [];
        };

        Closure::bind($clear, null, Model::class)();
        Model::clearBootedModels();
    }
}
