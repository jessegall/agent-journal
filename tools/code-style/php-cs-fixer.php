<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;
use Tools\CodeStyle\AttributeOrderFixer;
use Tools\CodeStyle\BlankLineAroundMultilineStatementFixer;
use Tools\CodeStyle\StandaloneAttributeFixer;

// The project's own code-style fixers, run right after Pint (which cannot load them) by composer lint and lint:check.
// It lives here, not as .php-cs-fixer.dist.php at the root, because Pint's parallel workers would read that file
// without the project's autoloader and fail on these fixers.
// The containers run PHP 8.6, newer than the fixer's declared syntax range; its fixers only read this project's 8.x code.
return new Config()
    ->setUnsupportedPhpVersionAllowed(true)
    ->setParallelConfig(ParallelConfigFactory::detect())
    ->registerCustomFixers([
        new BlankLineAroundMultilineStatementFixer(),
        new StandaloneAttributeFixer(),
        new AttributeOrderFixer(),
    ])
    ->setRules([
        'Journal/blank_line_around_multiline_statement' => true,
        'Journal/standalone_attribute' => true,
        'Journal/attribute_order' => true,
    ])
    ->setUsingCache(true)
    ->setCacheFile('storage/framework/cache/php-cs-fixer.cache')
    ->setFinder(new Finder()->in([
        dirname(__DIR__, 2).'/app',
        dirname(__DIR__, 2).'/domain',
    ])->exclude([
        'resources',
        'node_modules',
    ]));
