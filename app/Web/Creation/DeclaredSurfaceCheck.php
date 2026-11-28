<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\CorePages;
use App\Navigation\Declarations\DomainClient;
use App\Support\ClientDeclarations;
use App\Support\DeclaredType;
use App\Support\Reflector;
use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\Exceptions\InvalidSurface;
use Spatie\LaravelData\Data;

final class DeclaredSurfaceCheck
{
    /** @var array<string, true> */
    private array $pageFiles = [];

    /** @var array<string, true> */
    private array $windowFiles = [];

    public function __construct(private readonly PageFactory $pages, private readonly WindowFactory $windows) {}

    public function registerDeclarations(ClientDeclarations $declarations): void
    {
        $this->registerPage(CorePages::loginOwner(), 'login', CorePages::login());

        foreach ($declarations->pages() as $page) {
            $this->registerPage($page->owner, $page->key, $page->surface);

            if ($page->window !== null) {
                $this->registerWindow($page->owner, $page->key, $page->window);
            }
        }
    }

    public function registerPage(DomainClient $owner, string $key, SurfaceDefinition $page): void
    {
        $this->assertProduct($owner, $key, $page);
        $this->assertBuilder($key, $page, WindowBuilder::class);
        $file = $owner->presentationFile($key, $page->component, $page->component === DomainClient::DECLARED_LAYOUT);

        if (isset($this->windowFiles[$file])) {
            throw InvalidSurface::sharedComponent($key, $file);
        }

        $this->pages->register($page->type, $page->builder);
        $this->pageFiles[$file] = true;
    }

    public function registerWindow(DomainClient $owner, string $key, SurfaceDefinition $window): void
    {
        $this->assertProduct($owner, $key, $window);
        $this->assertBuilder($key, $window, PageBuilder::class);

        if (! Reflector::exists($window->type)) {
            throw InvalidSurface::windowType($key, $window->type);
        }

        $parent = Reflector::of($window->type)->parent();

        if ($parent->filter(static fn (Reflector $class): bool => $class->name() === Data::class)->isEmpty()) {
            throw InvalidSurface::windowType($key, $window->type);
        }

        $file = $owner->componentFile($key, $window->component);

        if (isset($this->pageFiles[$file])) {
            throw InvalidSurface::sharedComponent($key, $file);
        }

        $this->windows->register($window->type, $window->builder);
        $this->windowFiles[$file] = true;
    }

    private function assertProduct(DomainClient $owner, string $key, SurfaceDefinition $surface): void
    {
        if (! $owner->owns($surface->type) || ! $owner->owns($surface->builder)) {
            throw InvalidSurface::unowned($key, $surface->type, $surface->builder);
        }

        if ($this->pages->hasBuilderFor($surface->type) || $this->windows->hasBuilderFor($surface->type)) {
            throw InvalidSurface::repeatedType($key, $surface->type);
        }
    }

    /** @param class-string $otherContract */
    private function assertBuilder(string $key, SurfaceDefinition $surface, string $otherContract): void
    {
        if (! Reflector::exists($surface->builder)) {
            throw InvalidSurface::builder($key, $surface->builder, $surface->type);
        }

        $builder = Reflector::of($surface->builder);

        if (! $builder->isFinal() || $builder->implements($otherContract) || ! $builder->hasMethod('build')) {
            throw InvalidSurface::builder($key, $surface->builder, $surface->type);
        }

        $return = $builder->method('build')->returnType()->filter(
            static fn (DeclaredType $type): bool => ! $type->allowsNull && $type->isNamedAs($surface->type),
        );

        if ($return->isEmpty()) {
            throw InvalidSurface::builder($key, $surface->builder, $surface->type);
        }
    }
}
