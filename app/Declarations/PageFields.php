<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Navigation\Contracts\PresentsLayout;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Enums\Icon;
use App\Support\Reflector;
use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\Exceptions\MissingFields;
use App\Web\Creation\SurfaceDefinition;
use App\Web\Exceptions\InvalidPageDeclaration;
use Spatie\LaravelData\Data;

final class PageFields
{
    private string $key;

    private string $title;

    private Icon $icon;

    /** @var class-string<Data> */
    private string $pageType;

    /** @var class-string<PageBuilder> */
    private string $pageBuilder;

    private string $component;

    private SurfaceDefinition|null $window = null;

    public function key(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    public function title(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function icon(Icon $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /** @param class-string<Data> $pageType */
    public function pageType(string $pageType): self
    {
        $this->pageType = $pageType;

        return $this;
    }

    /** @param  class-string<PageBuilder>  $builder */
    public function pageBuilder(string $builder): self
    {
        $this->pageBuilder = $builder;

        return $this;
    }

    public function component(string $component): self
    {
        $this->component = $component;

        return $this;
    }

    public function declaredLayout(): self
    {
        return $this->component(DomainClient::DECLARED_LAYOUT);
    }

    /**
     * @param  class-string<Data>  $type
     * @param  class-string<WindowBuilder>  $builder
     */
    public function withWindow(string $type, string $builder, string $component): self
    {
        $this->window = new SurfaceDefinition($type, $builder, $component);

        return $this;
    }

    public function finish(): Page
    {
        foreach ([
            'key',
            'title',
            'icon',
            'pageType',
            'pageBuilder',
            'component',
        ] as $field) {
            if (! isset($this->{$field})) {
                throw MissingFields::forType(Page::class, $field);
            }
        }

        $isDeclared = $this->component === DomainClient::DECLARED_LAYOUT;

        if ($isDeclared && ! Reflector::factory()->isSubclassOf($this->pageType, PresentsLayout::class)) {
            throw InvalidPageDeclaration::typePresentsNoLayout($this->key, $this->pageType);
        }

        return new Page(
            key: $this->key,
            title: $this->title,
            icon: $this->icon,
            path: $this->key,
            surface: new SurfaceDefinition($this->pageType, $this->pageBuilder, $this->component),
            floatSize: FloatSize::standard(),
            window: $this->window,
            isDeclared: $isDeclared,
        );
    }
}
