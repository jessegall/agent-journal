<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Creation\Exceptions\MissingFields;
use Inertia\AlwaysProp;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;

final class HomeVisitPropsFields
{
    private AlwaysProp $title;

    private Lazy|Data $page;

    public function title(AlwaysProp $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function page(Lazy|Data $page): self
    {
        $this->page = $page;

        return $this;
    }

    public function finish(): HomeVisitProps
    {
        if (! isset($this->title)) {
            throw MissingFields::forType(HomeVisitProps::class, 'title');
        }

        if (! isset($this->page)) {
            throw MissingFields::forType(HomeVisitProps::class, 'page');
        }

        return new HomeVisitProps(
            title: $this->title,
            page: $this->page,
        );
    }
}
