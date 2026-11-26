<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\DomainEntry;
use Tests\Support\Exceptions\DomainNotBooted;

/**
 * Refuses to load a class of a domain the running test did not boot; the domain's own tests folder aside. It sees
 * only a class not loaded yet in this process, so it catches a reach a test makes first.
 */
final class DomainLoadGuard
{
    private const string DOMAIN_ROOT = 'Domain\\';

    /**
     * The names of the domains the running test boots; every domain before a test names its own.
     *
     * @var list<string>|null
     */
    private static array|null $booted = null;

    private static bool $isRegistered = false;

    /**
     * From now on only the given domains' classes load.
     *
     * @param  list<class-string>  $domainClasses
     */
    public static function boot(array $domainClasses): void
    {
        self::$booted = array_map(DomainEntry::nameOf(...), $domainClasses);

        if (! self::$isRegistered) {
            spl_autoload_register(self::check(...), prepend: true);
            self::$isRegistered = true;
        }
    }

    private static function check(string $class): void
    {
        if (self::$booted === null || ! str_starts_with($class, self::DOMAIN_ROOT)) {
            return;
        }

        [, $domain, $part] = [...explode('\\', $class), '', ''];

        if ($part !== 'Tests' && ! in_array($domain, self::$booted, true)) {
            throw DomainNotBooted::for($class, $domain);
        }
    }
}
