<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\PlanPart;
use App\Agents\Values\PlanFile;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The hooks a contained Codex relays to the journal, whatever account it runs on: a plan file the container mounts
 * where Codex reads its system hooks, which run without a trust entry and leave the account folder untouched.
 */
final readonly class CodexManagedHooks implements PlanPart
{
    /**
     * The plan file of the hooks, and where Codex reads its system hooks in its container.
     */
    public const string FILE = 'codex-hooks.json';

    public const string TARGET = '/etc/codex/hooks.json';

    public function __invoke(DriverStart $start): PlanAddition
    {
        if ($start->hookCommand === null) {
            return new PlanAddition();
        }

        $hooks = CodexHomeFiles::hooksRelaying($start->hookCommand);

        return new PlanAddition(files: [PlanFile::template(self::FILE, json_encode(
            ['hooks' => $hooks],
            JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
        ))]);
    }
}
