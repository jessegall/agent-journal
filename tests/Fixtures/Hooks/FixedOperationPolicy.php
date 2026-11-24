<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Enums\AccessRuleType;
use App\Values\AccessDecision;
use App\Values\Operation;
use App\Contracts\Authorization\OperationPolicy;
use App\Enums\AccessType;

/**
 * An operation policy fixed for a test: it allows every operation, or every one that changes no files.
 */
final readonly class FixedOperationPolicy implements OperationPolicy
{
    public const string NO_CHANGES_REASON = 'Your profile grants no changes to workspace files';

    public function __construct(private bool $changesFiles = true) {}


    public function assess(Operation $operation): AccessDecision
    {
        $changesFiles = array_any($operation->accessTypes, fn (AccessType $access): bool => $access->changesFiles());

        if ($changesFiles && ! $this->changesFiles) {
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
