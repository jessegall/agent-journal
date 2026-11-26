<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use App\Navigation\Contracts\DeclaredPages;

/**
 * A page a card opens: the key of a declared page and its route arguments, never a written address.
 */
final readonly class DockDestination
{
    /**
     * @var list<DestinationArgument>
     */
    public array $arguments;

    public function __construct(public string $page, DestinationArgument ...$arguments)
    {
        $this->arguments = array_values($arguments);
    }

    public function isDeclaredIn(DeclaredPages $pages): bool
    {
        return $pages->declares($this->page);
    }

    /**
     * The address the browser follows: the declared page served with these arguments.
     */
    public function linkIn(DeclaredPages $pages): DockLink
    {
        $arguments = [];

        foreach ($this->arguments as $argument) {
            $arguments[$argument->name] = $argument->value;
        }

        return new DockLink($this->page, $pages->addressOf($this->page, $arguments));
    }
}
