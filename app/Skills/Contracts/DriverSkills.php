<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Enums\SkillReload;
use App\Values\SkillDelivery;
use App\Values\SkillKey;

/**
 * How one driver finds its skills: the layout of a published set, the folder the host writes it to and what the
 * start adds, how an agent is told to read a skill, and whether a running session sees a changed set.
 */
interface DriverSkills
{
    /**
     * The skill protocol this adapter writes and installs, which every driver registration of its family names.
     */
    public function skillProtocol(): string;

    /**
     * The path of a skill's SKILL.md inside the driver's target folder.
     */
    public function skillFile(SkillKey $key): string;

    /**
     * Files the driver needs beside the skills to discover them, bytes by path inside the target folder.
     *
     * @return array<string, string>
     */
    public function supportFiles(): array;

    /**
     * How skills reach an agent of the driver, as files or through a tool.
     */
    public function delivery(): SkillDelivery;

    /**
     * Whether the driver reads changed skills at once or only in a new session.
     */
    public function reloadMode(): SkillReload;
}
