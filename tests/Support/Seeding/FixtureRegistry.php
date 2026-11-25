<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use App\Support\Reflector;
use Closure;
use Illuminate\Support\Str;
use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The fixture builders of the domains this application booted, each made once on first use: a domain registers its
 * own through its Tests\Fixtures\Fixtures class, and a builder of a domain not booted is refused by name.
 */
final class FixtureRegistry
{
    private const string REGISTRAR = 'Tests\\Fixtures\\Fixtures';

    /**
     * @var array<class-string, Closure(TestJournal): object>
     */
    private array $makers = [];

    /**
     * @var array<class-string, object>
     */
    private array $built = [];

    private bool $isRegistered = false;

    public function __construct(private readonly DomainRegistry $domains) {}

    /**
     * @param  class-string  $fixtures
     * @param  Closure(TestJournal): object  $maker
     */
    public function register(DomainEntry $owner, string $fixtures, Closure $maker): void
    {
        if (! $owner->ownsName($fixtures)) {
            throw FixtureRefused::foreign($fixtures, $owner->className());
        }

        if (array_key_exists($fixtures, $this->makers)) {
            throw FixtureRefused::duplicate($fixtures);
        }

        $this->makers[$fixtures] = $maker;
    }

    /**
     * The builder of the class, made the first time it is asked for and kept after.
     *
     * @template TFixtures of object
     *
     * @param  class-string<TFixtures>  $fixtures
     * @return TFixtures
     */
    public function fixtures(string $fixtures, TestJournal $journal): object
    {
        $this->registerBooted();

        $made = $this->built[$fixtures] ?? ($this->makers[$fixtures] ?? throw $this->missing($fixtures))($journal);

        if (! Reflector::of($fixtures)->isInstance($made)) {
            throw FixtureRefused::wrongResult($fixtures, $made::class);
        }

        return $this->built[$fixtures] = $made;
    }

    /**
     * Lets every booted domain with a Fixtures class register its builders, once.
     */
    private function registerBooted(): void
    {
        if ($this->isRegistered) {
            return;
        }

        $this->isRegistered = true;

        foreach ($this->domains->all() as $domain) {
            $registrar = Str::beforeLast($domain->className(), '\\').'\\'.self::REGISTRAR;

            if (! Reflector::exists($registrar)) {
                continue;
            }

            if (! Reflector::of($registrar)->implements(DomainFixtures::class)) {
                throw FixtureRefused::invalidRegistrar($registrar, 'it does not implement DomainFixtures');
            }

            $registrar::register(new FixtureRegistration($domain, $this));
        }
    }

    /**
     * @param  class-string  $fixtures
     */
    private function missing(string $fixtures): FixtureRefused
    {
        if (str_starts_with($fixtures, 'Domain\\')) {
            return FixtureRefused::domainNotBooted(Str::betweenFirst($fixtures, 'Domain\\', '\\'));
        }

        return FixtureRefused::unregistered($fixtures);
    }
}
