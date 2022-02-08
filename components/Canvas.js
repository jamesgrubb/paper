import { Engine, Render, World, Bodies } from 'matter-js';
import { useEffect, useRef } from 'react';
import { paper } from 'paper';
function Canvas(props) {
	const scene = useRef();
	const engine = useRef(Engine.create());
	const paperRef = useRef();
	const raf = useRef();

	useEffect(() => {
		const time = 0;
		window.addEventListener('load', () => {
			paper.setup(paperRef.current);

			const cw = document.body.clientWidth;
			const ch = document.body.clientHeight;

			const render = Render.create({
				element: scene.current,
				engine: engine.current,
				options: {
					width: cw,
					height: ch,
					wireframes: false,
					background: 'transparent',
				},
			});
			World.add(engine.current.world, [
				Bodies.rectangle(cw / 2, -10, cw, 20, {
					isStatic: true,
				}),
				Bodies.rectangle(-10, ch / 2, 20, ch, {
					isStatic: true,
					fillStyle: '#F35e66',
				}),
				Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
					isStatic: true,
					fillStyle: '#F35e66',
				}),
				Bodies.rectangle(cw + 10, ch / 2, 20, ch, {
					isStatic: true,
					fillStyle: '#F35e66',
				}),
			]);

			Engine.run(engine.current);
			Render.run(render);
			const balls = [];
			for (let i = 0; i < 20; i++) {
				balls.push(
					Bodies.circle(Math.random() * cw, 0, 80, {
						density: Math.random(),
						friction: 0.01,
						frictionAir: 0.00001,
						restitution: 0.8,
						render: {
							fillStyle: '#F35e66',
							strokeStyle: 'black',
							lineWidth: 1,
						},
					})
				);
			}

			var ball = Bodies.circle(0, 0, 20, {
				density: 0.04,
				friction: 0.01,
				frictionAir: 0.00001,
				restitution: 0.8,
				render: {
					fillStyle: '#F35e66',
					strokeStyle: 'black',
					lineWidth: 1,
				},
			});
			for (let i = 0; i < balls.length; i++) {
				World.add(engine.current.world, [balls[i]]);
			}

			console.log(ball);
			const callback = () => {
				paper.view.update();
				paper.project.clear();
				balls.forEach((ball) => {
					let shape = new paper.Path.RegularPolygon({
						position: new paper.Point([
							ball.position.x,
							ball.position.y,
						]),
						sides: 5,
						radius: 100,
						fillColor: 'tomato',
					});
					shape.rotate(ball.angle);
				});
				const shape = new paper.Path.RegularPolygon({
					position: new paper.Point([
						ball.position.x,
						ball.position.y,
					]),
					sides: 5,
					radius: 100,
					fillColor: 'tomato',
				});
				shape.rotate(ball.angle);
				raf.current = requestAnimationFrame(callback);
			};

			raf.current = requestAnimationFrame(callback);

			return () => {
				cancelAnimationFrame(raf.current);
				Render.stop(render);
				World.clear(engine.current.world);
				Engine.clear(engine.current);
				render.canvas.remove();
				render.canvas = null;
				render.context = null;
				render.textures = {};
			};
		});
	}, []);

	return (
		<div className=''>
			<div className='paper'>
				<canvas
					resize='true'
					ref={paperRef}
					style={{
						width: '100%',
						height: '100%',
						position: 'fixed',
						top: 0,
						left: 0,
					}}
				/>
			</div>
			<div
				ref={scene}
				style={{
					display: 'none',
					width: '100%',
					height: '100%',
					position: 'fixed',
					top: 0,
					left: 0,
				}}
			/>
		</div>
	);
}

export default Canvas;
