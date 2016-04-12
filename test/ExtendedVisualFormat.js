/*global describe, it*/
var assert = (typeof window === 'undefined') ? require('assert') : window.chai.assert;
var AutoLayout = (typeof window === 'undefined') ? require('../dist/autolayout') : window.AutoLayout;

var opts = {extended: true};
describe('ExtendedVisualFormat', function() {
    describe('comments', function() {
        it('allow end of line comments: ' + '|[child]| //comments here', function() {
            var constraints = AutoLayout.VisualFormat.parse('|[child]| // comments here', opts);
            assert.equal(2, constraints.length);
        });
        it('allow end of line comments (no spaces): ' + '|[child]|//comments here', function() {
            var constraints = AutoLayout.VisualFormat.parse('|[child]|//comments here', opts);
            assert.equal(2, constraints.length);
        });
        it('allow whole line comments: ' + '//|[child]|', function() {
            var constraints = AutoLayout.VisualFormat.parse('//|[child]|', opts);
            assert.equal(0, constraints.length);
        });
    });

    describe('parse', function() {
        it('should return 1 contraint for: ' + '[child(60)] with constant 60', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(60)]', opts);
            assert.equal(1, constraints.length);
            assert.equal(constraints[0].constant, 60);
        });
        it('should return 1 contraint for: ' + '[child(60.6666)] with constant 60.6666', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(60.6666)]', opts);
            assert.equal(1, constraints.length);
            assert.equal(constraints[0].constant, 60.6666);
        });
    });

    describe('connections', function() {
        it('should position child2 right of child: ' + '[child][child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child][child2]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'right');
            assert.equal(c.relation, 'equ');
            assert.equal(c.view2, 'child2');
            assert.equal(c.attr2, 'left');
            assert.equal(c.constant, 0);
        });
        it('should position child2 right of child: ' + '[child]-10-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child]-10-[child2]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'right');
            assert.equal(c.relation, 'equ');
            assert.equal(c.view2, 'child2');
            assert.equal(c.attr2, 'left');
            assert.equal(c.constant, -10);
        });
        it('should position child2 right of child: ' + '[child]-(50)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child]-(50)-[child2]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'right');
            assert.equal(c.relation, 'equ');
            assert.equal(c.view2, 'child2');
            assert.equal(c.attr2, 'left');
            assert.equal(c.constant, -50);
        });
        it('should position child2 right of child: ' + '[child]-(-22)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child]-(-22)-[child2]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'right');
            assert.equal(c.relation, 'equ');
            assert.equal(c.view2, 'child2');
            assert.equal(c.attr2, 'left');
            assert.equal(c.constant, 22);
        });
        it('should position child2 right of child: ' + '[child]-10%-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child]-10%-[child2]', opts);
            assert.equal(3, constraints.length);
        });
        it('should position child2 right of child: ' + '[child]-(15%)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child]-(15%)-[child2]', opts);
            assert.equal(3, constraints.length);
        });
        it('should position child2 right of child: ' + '[child]-(-10%)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child]-(-10%)-[child2]', opts);
            assert.equal(3, constraints.length);
        });
        it('should position child2 right of child: ' + '[child(60)]-(child/10)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(60)]-(child/10)-[child2]', opts);
            assert.equal(4, constraints.length);
        });
        it('should position child2 right of child: ' + '[child(60)]-(child/-10)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(60)]-(child/-10)-[child2]', opts);
            assert.equal(4, constraints.length);
        });
        it('should position child2 right of child: ' + '[child(60)]-(child/+10)-[child2]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(60)]-(child/+10)-[child2]', opts);
            assert.equal(4, constraints.length);
        });
    });

    describe('proportional size', function() {
        it('width should be 50%: ' + '[child(50%)]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(50%)]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'width');
            assert.equal(c.relation, 'equ');
            assert.equal(c.view2, null);
            assert.equal(c.attr2, 'width');
            assert.equal(c.multiplier, 0.5);
        });
        it('width should be >= 50%: ' + '[child(>=50%)]', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(>=50%)]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'width');
            assert.equal(c.relation, 'geq');
            assert.equal(c.view2, null);
            assert.equal(c.attr2, 'width');
            assert.equal(c.multiplier, 0.5);
        });
        it('width should be -10%: ' + '[child(-10%)] (fictional scenario)', function() {
            var constraints = AutoLayout.VisualFormat.parse('[child(-10%)]', opts);
            assert.equal(1, constraints.length);
            var c = constraints[0];
            assert.equal(c.view1, 'child');
            assert.equal(c.attr1, 'width');
            assert.equal(c.relation, 'equ');
            assert.equal(c.view2, null);
            assert.equal(c.attr2, 'width');
            assert.equal(c.multiplier, -0.1);
        });
    });
});