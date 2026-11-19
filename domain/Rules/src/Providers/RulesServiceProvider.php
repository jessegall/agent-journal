<?php

declare(strict_types=1);

namespace Domain\Rules\Providers;

use App\Links\Support\LinkTypeRegistry;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\Resolvers\RuleDetailRecords;
use Domain\Rules\Resolvers\RuleRecords;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Routing\Redirector;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Registers the stable link names of Rules's own models.
 */
final class RulesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(RuleDetailsResolver::class, RuleDetailRecords::class);
        $this->app->bind(RuleResolver::class, RuleRecords::class);
    }

    public function boot(LinkTypeRegistry $links, ExceptionHandler $exceptions): void
    {
        // A missing rule is not found; a rule no longer proposed is a review error on the review buttons.
        if ($exceptions instanceof Handler) {
            $exceptions->map(
                RuleMissing::class,
                fn (RuleMissing $missing) => new NotFoundHttpException(previous: $missing),
            );
            $exceptions->renderable(
                fn (RuleNotProposed $settled) => $this->app->make(Redirector::class)->back(303)->withErrors(
                    ['review' => $settled->getMessage()],
                ),
            );
        }

        $links->register([
            'rules.rule' => Rule::class,
        ]);
    }
}
