<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Enums\AccessRuleType;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\Operation;
use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Contracts\StopConditionGate;
use App\Hooks\States\Support\ReadyStateLoader;
use App\Operations\Enums\AccessType;
use Illuminate\Container\Container;

/**
 * An operation policy fixed for a test: it allows every operation, or every one that changes no files.
 */
final readonly class FixedOperationPolicy implements OperationPolicy
{
    public function __construct(private bool $mayChangeFiles = true) {}

    /**
     * A ready state loader whose container gives this policy to every ready state it builds.
     */
    public static function loader(bool $mayChangeFiles = true): ReadyStateLoader
    {
        $container = new Container();
        $container->instance(OperationPolicy::class, new self($mayChangeFiles));
        $container->instance(StopConditionGate::class, new AllowedStops());

        return new ReadyStateLoader($container);
    }

    public function assess(Operation $operation): AccessDecision
    {
        $changesFiles = array_any($operation->accessTypes, fn (AccessType $access): bool => $access->changesFiles());

        if ($changesFiles && ! $this->mayChangeFiles) {
            return AccessDecision::refused(
                AccessRuleType::NotGranted,
                sprintf(
                    'Your profile grants no changes to workspace files, so %s of %s is refused.',
                    $operation->name,
                    implode(', ', $operation->arguments),
                ),
            );
        }

        return AccessDecision::allowed(AccessRuleType::ScopeGrant, 'The test policy allows it.');
    }
}
