<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Http\Middleware\AuthenticateDeviceGrant;

/**
 * Who a route answers, read from the middleware the router gathered for it, and the caller its refusal test sends in
 * its place.
 */
enum Caller: string
{
    case User = 'user';
    case Agent = 'agent';
    case SharedHost = 'shared host';
    case RelayHost = 'relay host';
    case DeviceGrant = 'device grant';
    case Guest = 'guest';
    case Public = 'public';

    /**
     * The caller the gathered middleware lets in: an agent, a relay or other host, a device grant, a guest, a user, and
     * otherwise anyone.
     *
     * @param  list<string>  $middleware
     */
    public static function of(array $middleware): self
    {
        $named = fn (string $name) => in_array($name, $middleware, true);
        $prefixed = fn (string $prefix) => array_filter(
            $middleware,
            fn (string $one) => str_starts_with($one, $prefix),
        );

        return match (true) {
            $named('journal.agent') => self::Agent,
            $named('journal.host:relay') => self::RelayHost,
            $prefixed('journal.host') !== [] => self::SharedHost,
            $named(AuthenticateDeviceGrant::class) => self::DeviceGrant,
            $named('guest') => self::Guest,
            $named('auth'), $named('journal.user') => self::User,
            default => self::Public,
        };
    }

    /**
     * Whether a test of a route this caller answers also shows the call of another caller refused.
     */
    public function isGuarded(): bool
    {
        return $this !== self::Public;
    }
}
