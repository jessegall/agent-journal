<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Contracts\Authorization\OperationPolicy;
use App\Enums\Agents\AccessType;
use App\Enums\Profiles\AccessRuleType;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\Operation;

/**
 * An operation policy fixed for a test: it allows every operation, or every one that changes no files.
 */
final readonly class FixedOperationPolicy implements OperationPolicy
{
    public function __construct(private bool $changesFiles = true) {}

    public function assess(Operation $operation): AccessDecision
    {
        $changesFiles = array_any($operation->accessTypes, fn (AccessType $access): bool => $access->changesFiles());

        if ($changesFiles && ! $this->changesFiles) {
            return AccessDecision::refused(
                AccessRuleType::NotGranted,
                AgentText::of('core.access.scope_missing', [
                    'operation' => $operation->name,
                    'access' => 'changes',
                    'target' => implode(', ', $operation->arguments),
                ]),
            );
        }

        return AccessDecision::allowed(AccessRuleType::ScopeGrant, AgentText::of('core.access.no_profile'));
    }
}
