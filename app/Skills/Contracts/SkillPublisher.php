<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\RenderedSkill;
use App\Skills\Values\SkillDelivery;

/**
 * Writes rendered skills to the host for one delivery target: it stages a complete set apart, then switches the
 * target to it in one step.
 */
interface SkillPublisher
{
    /**
     * Stages the set and returns the digest of its manifest.
     *
     * @param  list<RenderedSkill>  $skills
     */
    public function stage(SkillDelivery $delivery, array $skills): string;

    /**
     * Points the delivery target at the staged set with this manifest digest.
     */
    public function activate(SkillDelivery $delivery, string $manifestDigest): void;
}
