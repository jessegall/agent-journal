<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\MarkTone;
use App\Agents\Drivers\Enums\SignInCodeDirection;
use App\Agents\Values\ProviderKey;
use App\Profiles\Enums\ModelTier;

/**
 * One family of drivers, such as Claude Code, which a terminal and a headless driver share: its name as users read
 * it, the provider that runs it, the name the protected host knows it by, and how pages show it.
 */
final readonly class DriverFamily
{
    /**
     * @param  string  $key  the family's stable key, such as claude-code, which each of its registrations names
     * @param  string  $label  the family's name as users read it, such as on an account named after it
     * @param  string  $hostName  the name the protected host knows the family by, as its profiles and start protocol write it
     * @param  bool  $isolatesHooksPerSession  whether the family's drivers scope their hooks to one session, as a connected
     *                                         project folder needs to run it isolated
     * @param  list<string>  $models  the models the family's drivers run, one per tier, cheapest first; every one
     *                                can be chosen at any start
     * @param  list<string>  $aliases  the other names the family's records may hold: a short name or a registration key
     * @param  string  $markAsset  the family's mark under public, such as images/drivers/claude-code.svg
     * @param  MarkTone  $markTone  whether the mark is drawn in its own colours or in the text colour
     * @param  SignInCodeDirection  $signInCode  which way the code of an account's sign-in travels
     */
    public function __construct(
        public string $key,
        public string $label,
        public ProviderKey $provider,
        public string $hostName,
        public bool $isolatesHooksPerSession,
        public array $models,
        public array $aliases,
        public string $markAsset,
        public MarkTone $markTone,
        public SignInCodeDirection $signInCode,
    ) {}

    /**
     * The family's model for work of a tier: the default model of a start whose profile prefers that tier.
     */
    public function modelAt(ModelTier $tier): string
    {
        return $this->models[$tier->value - 1];
    }
}
