<?php

declare(strict_types=1);

namespace Domain\Rules\Providers;

use App\Contracts\ReadEntitlements;
use App\Support\LinkTypeRegistry;
use App\Values\ReadEntitlement;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Contracts\RuleResolver;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Exceptions\RuleNotProposed;
use Domain\Rules\Models\Rule;
use Domain\Rules\Policies\RulePolicy;
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

    public function boot(LinkTypeRegistry $links, ExceptionHandler $exceptions, ReadEntitlements $reads): void
    {
        $readGrant = ReadEntitlement::grant(RulePolicy::class);

        $reads->declare('rules_read', $readGrant);
        $reads->declare('rules_list', $readGrant);

        // A missing rule is not found; a rule no longer proposed is a review error on the review buttons.
        if ($exceptions instanceof Handler) {
            $exceptions->map(
                RuleMissing::class,
                fn (RuleMissing $missingRule) => new NotFoundHttpException(previous: $missingRule),
            );

            $exceptions->renderable(
                fn (RuleNotProposed $settled) => $this->app->make(Redirector::class)->back(303)->withErrors(
                    ['review' => $settled->getMessage()],
                ),
            );
        }

        $links->register([
            Rule::LINK_TYPE => Rule::class,
        ]);
    }
}
