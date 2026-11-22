<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\ActorType;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\RecordIdentity;
use App\Values\StackTarget;
use Domain\Access\Support\AccessSettings;

/**
 * Builds a test user's actor and a test record's identity from their plain numbers, so a test names the number and
 * never converts it itself.
 */
final class TestActors
{
    public static function user(int $number): ActorContext
    {
        return ActorContext::forUser(TestIds::of($number));
    }

    public static function userIdentity(int $number): ActorIdentity
    {
        return new ActorIdentity(ActorType::User, TestIds::of($number));
    }

    public static function record(string $alias, int $number): RecordIdentity
    {
        return new RecordIdentity($alias, TestIds::of($number));
    }

    public static function agentIdentity(int $number): ActorIdentity
    {
        return new ActorIdentity(ActorType::Agent, TestIds::of($number));
    }

    /**
     * The stack of test agent $agent in its test session $session.
     */
    public static function stack(int $agent, int $session): StackTarget
    {
        return new StackTarget(TestIds::of($agent), TestIds::of($session));
    }

    /**
     * The access settings that make test user $number the journal's owner.
     */
    public static function accessSettings(int $number): AccessSettings
    {
        return new AccessSettings(TestIds::of($number));
    }

    /**
     * The identity of hook call $hookId from test agent $agent in its test session $session.
     */
    public static function hookIdentity(int $agent, int $session, string $hookId, string $inputDigest): HookIdentity
    {
        return new HookIdentity(TestIds::of($agent), TestIds::of($session), $hookId, $inputDigest);
    }
}
