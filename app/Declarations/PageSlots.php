<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Profiles\Enums\SlotContextType;
use App\Web\Declarations\Slot;

/**
 * The places on a page where sections of any domain may show, added in its scope one after another.
 */
final class PageSlots
{
    /**
     * @var list<Slot>
     */
    private array $slots = [];

    /**
     * A slot that hands its sections nothing or the session chosen in the conversation window.
     */
    public function add(string $key, SlotContextType $takes): self
    {
        $this->slots[] = Slot::make($key, $takes);

        return $this;
    }

    /**
     * A slot that hands its sections the record whose number the route parameter of its page holds.
     */
    public function record(string $key, string $parameter, string $type): self
    {
        $this->slots[] = Slot::record($key, $parameter, $type);

        return $this;
    }

    /**
     * @return list<Slot>
     */
    public function slots(): array
    {
        return $this->slots;
    }
}
