<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Enums\AccessRuleType;
use App\Values\AccessDecision;
use App\Values\Operation;
use App\Contracts\Authorization\OperationPolicy;
use App\Support\States\Contracts\StopConditionGate;
use App\Support\StateLoading\Loaders\ReadyStateLoader;
use App\Enums\AccessType;
use Illuminate\Container\Container;

/**
 * An operation policy fixed for a test: it allows every operation, or every one that changes no files.
 */
final readonly class FixedOperationPolicy implements OperationPolicy
{
    public const string NO_CHANGES_REASON = 'Your profile grants no changes to workspace files';

    public function __construct(private bool $mayChangeFiles = true) {}

    /**
     * A ready state loader whose container gives this policy to every ready state it builds.
     */
    public static function loader(bool $mayChangeFiles = true): ReadyStateLoader
    {
        $container = new Container();
        $container->instance(OperationPolicy::class, new self($mayChangeFiles));
        $container->instance(StopConditionGate::class, new AllowedStops());

        return new ReadyStateLoader(static fn () => $container);
    }

    public function assess(Operation $operation): AccessDecision
    {
        $changesFiles = array_any($operation->accessTypes, fn (AccessType $access): bool => $access->changesFiles());

        if ($changesFiles && ! $this->mayChangeFiles) {
            return AccessDecision::refused(
                AccessRuleType::NotGranted,
                sprintf(
                    self::NO_CHANGES_REASON.', so %s of %s is refused.',
                    $operation->name,
                    implode(', ', $operation->arguments),
                ),
            );
        }

        return AccessDecision::allowed(AccessRuleType::ScopeGrant, 'The test policy allows it.');
    }
}
