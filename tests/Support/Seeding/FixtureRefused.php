<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use LogicException;

/**
 * The journal fixture refused a test's request before it wrote anything, naming what was asked and what to do instead.
 */
final class FixtureRefused extends LogicException
{
    public static function noOwner(): self
    {
        return new self('The journal has no owner: call owner() first.');
    }

    public static function secondOwner(): self
    {
        return new self('The journal has its owner already: arrange another user with user().');
    }

    public static function noServerClock(): self
    {
        return new self('The journal keeps the real server clock: call useServerClockAt() first.');
    }

    public static function missingAlias(string $type, string $alias, string $owner): self
    {
        return new self("{$owner} has no {$type} called {$alias}: arrange it first.");
    }

    public static function notOneStart(string $agent, int $count): self
    {
        return new self("{$agent} has {$count} starts, not one: name the start with sessionCalled() or startCalled().");
    }

    public static function selfChat(string $name): self
    {
        return new self("{$name} cannot chat with itself: name two different actors.");
    }

    public static function occupiedAlias(string $alias, string $existingType): self
    {
        return new self("The name {$alias} already belongs to a {$existingType}: give this one another name.");
    }

    public static function domainNotBooted(string $domain): self
    {
        return new self("The {$domain} domain is not booted in this test case: boot it to use its fixtures.");
    }

    public static function unregistered(string $class): self
    {
        return new self("No booted domain registers {$class}: register it in that domain's fixtures.");
    }

    public static function invalidRegistrar(string $class, string $why): self
    {
        return new self("{$class} cannot register fixtures: {$why}.");
    }

    public static function duplicate(string $class): self
    {
        return new self("{$class} is registered twice: register it once.");
    }

    public static function foreign(string $class, string $owner): self
    {
        return new self("{$class} lies outside {$owner}: a domain registers only its own fixtures.");
    }

    public static function wrongResult(string $class, string $got): self
    {
        return new self("The maker of {$class} made a {$got}: it must make a {$class}.");
    }

    public static function wrongRecord(string $expected, string $got): self
    {
        return new self("A {$got} record was given where a {$expected} belongs: give a {$expected}.");
    }

    public static function hookReplayed(string $callId): self
    {
        return new self(
            "The hook of call {$callId} was replayed, not answered: send each hook under a call of its own.",
        );
    }

    public static function notOneFrame(string $typeKey, int $count): self
    {
        return new self("The stack holds {$count} frames of {$typeKey} for this reference, not one: name its subject.");
    }

    public static function noHookAnswer(string $lastStep): self
    {
        return new self("The last step given was {$lastStep}, not a hook: an answer is read only after a hook input.");
    }
}
