<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Bus\Contracts\DeclaresClassLevelAbilities;

/**
 * What an actor may do with the journal's agents: run a key script on an agent's terminal, retire another agent, or
 * read and maintain the starts that use an account.
 */
enum AgentAbility: string implements DeclaresClassLevelAbilities
{
    case RunKeyScript = 'run-key-script';
    case RetireOthers = 'retire-others';
    case Work = 'work';
    case Inspect = 'inspect';
    case Steer = 'steer';
    case Recover = 'recover';
    case Navigate = 'navigate';
    case ReadAccountUses = 'read-account-uses';
    case MaintainAccountUses = 'maintain-account-uses';

    /**
     * Each is decided on the model class alone, before the handler loads a record.
     */
    public function isClassLevel(): bool
    {
        return true;
    }
}
