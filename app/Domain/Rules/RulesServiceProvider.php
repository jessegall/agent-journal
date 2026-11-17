<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Core\Links\Support\LinkTypes;
use App\Domain\Rules\Models\Rule;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the stable link names of Rules's own models.
 */
final class RulesServiceProvider extends ServiceProvider
{
    public function boot(LinkTypes $links): void
    {
        $links->register([
            'rules.rule' => Rule::class,
        ]);
    }
}
