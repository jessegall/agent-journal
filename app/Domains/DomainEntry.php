<?php

declare(strict_types=1);

namespace App\Domains;

use App\Domains\Exceptions\DomainRequiresItself;
use App\Domains\Exceptions\NotADomain;
use App\Domains\Exceptions\RequiredDomainTwice;
use Illuminate\Support\Str;
use ReflectionClass;

/**
 * One registered domain: its name, namespace and folder, read from its Domain class.
 */
final readonly class DomainEntry
{
    /**
     * @param  list<class-string<Domain>>  $requires
     */
    private function __construct(
        public string $name,
        public string $namespace,
        public string $folder,
        public Domain $domain,
        public array $requires,
    ) {}

    /**
     * Reads a Domain class and refuses a declaration the application cannot start with.
     */
    public static function fromClass(string $className): self
    {
        if (! is_subclass_of($className, Domain::class)) {
            throw NotADomain::for($className);
        }

        $class = new ReflectionClass($className);
        $file = $class->getFileName();

        if ($file === false) {
            throw NotADomain::for($className);
        }

        $domain = $class->newInstance();
        $name = self::nameOf($className);

        return new self(
            name: $name,
            namespace: $class->getNamespaceName(),
            folder: dirname($file),
            domain: $domain,
            requires: self::checkedRequirements($name, $className, $domain->requires()),
        );
    }

    /**
     * The domain name: the last segment of the Domain class namespace.
     */
    public static function nameOf(string $className): string
    {
        return Str::afterLast(Str::beforeLast($className, '\\'), '\\');
    }

    public function className(): string
    {
        return $this->domain::class;
    }

    /**
     * Whether a fully written name lies in this domain, compared without regard to case and on whole segments.
     */
    public function ownsName(string $name): bool
    {
        return stripos(ltrim($name, '\\'), $this->namespace.'\\') === 0;
    }

    public function holdsFile(string $path): bool
    {
        return str_starts_with($path, $this->folder.DIRECTORY_SEPARATOR);
    }

    public function requiresDomain(self $other): bool
    {
        return in_array($other->className(), $this->requires, true);
    }

    public function listenerFolder(): string
    {
        return $this->folder.'/Listeners';
    }

    public function migrationFolder(): string
    {
        return $this->folder.'/Database/Migrations';
    }

    /**
     * @param  list<class-string<Domain>>  $requires
     * @return list<class-string<Domain>>
     */
    private static function checkedRequirements(string $name, string $className, array $requires): array
    {
        $seen = [];

        foreach ($requires as $requiredClass) {
            if (! is_subclass_of($requiredClass, Domain::class)) {
                throw NotADomain::for($requiredClass);
            }

            if ($requiredClass === $className) {
                throw DomainRequiresItself::for($name);
            }

            if (in_array($requiredClass, $seen, true)) {
                throw RequiredDomainTwice::for($name, self::nameOf($requiredClass));
            }

            $seen[] = $requiredClass;
        }

        return $seen;
    }
}
