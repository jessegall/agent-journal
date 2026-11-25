<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Rules\RequiresInterface;
use App\Exceptions\TraitInterfaceMissing;

/**
 * Checks that a class implements what each of its traits asks for with #[RequiresInterface], once per class: the
 * container asks it for every object it resolves, and a domain asks it as it boots.
 */
final class TraitRequirements
{
    /**
     * @var array<class-string, true>
     */
    private array $checked = [];

    /**
     * @param  class-string  $class
     *
     * @throws TraitInterfaceMissing
     */
    public function assertMetBy(string $class): void
    {
        if ($this->hasChecked($class)) {
            return;
        }

        $type = Reflector::of($class);

        foreach ($type->allTraits() as $trait) {
            foreach ($trait->attributes(RequiresInterface::class) as $requirement) {
                if (! $requirement->isMetBy($type)) {
                    throw TraitInterfaceMissing::for($class, $trait->name(), $requirement->interfaces);
                }
            }
        }

        $this->checked[$class] = true;
    }

    /**
     * @param  class-string  $class
     */
    public function hasChecked(string $class): bool
    {
        return isset($this->checked[$class]);
    }
}
