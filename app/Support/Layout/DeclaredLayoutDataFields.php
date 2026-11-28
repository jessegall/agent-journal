<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class DeclaredLayoutDataFields
{
    private LayoutPartData $root;

    public function root(LayoutPartData $root): self
    {
        $this->root = $root;

        return $this;
    }

    public function finish(): DeclaredLayoutData
    {
        if (! isset($this->root)) {
            throw MissingFields::forType(DeclaredLayoutData::class, 'root');
        }

        return new DeclaredLayoutData(
            root: $this->root,
        );
    }
}
