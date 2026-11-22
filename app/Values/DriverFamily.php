<?php

declare(strict_types=1);

namespace App\Values;

/**
 * One family of drivers, such as Claude Code, which a terminal and a headless driver share: its name as people read
 * it, the provider that runs it and the name the protected host knows it by.
 */
final readonly class DriverFamily
{
    /**
     * @param  string  $key  the family's stable key, such as claude-code, which each of its registrations names
     * @param  string  $label  the family's name as people read it, such as on an account named after it
     * @param  string  $hostName  the name the protected host knows the family by, as its profiles and start protocol write it
     * @param  bool  $isolatesHooksPerSession  whether the family's drivers scope their hooks to one session, as a connected
     *                                         project folder needs to run it isolated
     */
    public function __construct(
        public string $key,
        public string $label,
        public ProviderKey $provider,
        public string $hostName,
        public bool $isolatesHooksPerSession,
    ) {}
}
