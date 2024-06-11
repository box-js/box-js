export class Transform{
  position;
  rotation;
  scale;
  constructor(scale=new Vec2(1,1), position=new Vec2(0,0), rotation=0){
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
  
  resize(resizeBy){
    this.scale.add(resizeBy);
  }
  move(moveBy){
    this.position.add(moveBy);
  }
  move_x(x){
    this.position.add(x, 0);
  }
  move_y(y){
    this.position.add(0, y);
  }
  rotate(rot){
    this.rotation += rot;
  }
}


export class Vec2{
  x; y;
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
  
  add(x, y) {
    this.x += x;
    this.y += y;
  }
  
  add(othervec) {
    this.x += othervec.x;
    this.y += othervec.y;
  }
  
  zero(){
    this.x = this.y = 0;
  }
}

export class Box{
  resolution; offset; flags; bgcol; framerate; frame;
  _cv; _ctx; 
  sprites = [];
  constructor(framerate, resolution, offset=new Vec2(0,0), flags=FLAGS.DEFAULT, background_color = "#346" ){
    this.resolution = resolution;
    this.offset = offset;
    this.flags = flags;
    this.bgcol = background_color;
    this.framerate = 1000/framerate;
    this.frame = 0;
  }
  
  begin(root=document.body){
    this._cv = document.createElement("canvas");
    this._cv.width = this.resolution.x;
    this._cv.height = this.resolution.y;
    
    root.appendChild(this._cv);
    
    this._ctx = this._cv.getContext("2d");
  }
  
  render(){
    this.doFlagCheck();
    
    this._ctx.fillStyle = this.bgcol;
    this._ctx.fillRect(0,0,this.resolution.x, this.resolution.y);
    
    
    for(const sprite of this.sprites){
      sprite._render(this._ctx);
    }
    this.frame+=1;
  }
  
  add_sprite(sprite){
    this.sprites.push(sprite);
  }
  
  _test(){
    console.log(this.resolution);
    console.log(this.offset);
    console.log(this.flags);
  }
  
  doFlagCheck(){
    switch(this.flags){
      case FLAGS.DEFAULT:
        break;
      case FLAGS.FILL_SCREEN:
        this._cv.style.width = innerWidth;
        this._cv.style.height = innerHeight;
        break;
      case FLAGS.KEEP_WIDTH:
        this._cv.style.height = innerHeight;
        this._cv.style.width = innerHeight;
        break;
      case FLAGS.KEEP_HEIGHT:
        this._cv.style.width = innerWidth;
        this._cv.style.height = innerWidth;
      case FLAGS.CUT_OFF:
        break;
    }
  }
}



export class Sprite{
  shape; transform; color;
  constructor(color = "white", shape=SHAPE.RECT, transform=new Transform(new Vec2(100,100), new Vec2(0,0), 0)){
    this.shape = shape;
    //this.collision_shape = collision_shape;
    this.transform = transform;
    this.color = color;
  }
  
  setSize(newScale) {
    this.transform.scale = newScale; return this;
  }
  setPosition(newPos) {
    this.transform.position = newPos; return this;
  }
  setRotation(newRot) {
    this.transform.rotation += newRot; return this;
  }
  changeSize(scale) {
    this.transform.scale += scale; return this;
  }
  changePosition(pos) {
    this.transform.position += pos; return this;
  }
  changeRotation(rot) {
    this.transform.rotation += rot; return this;
  }
  
  
  setPos(newPos) {
    this.transform.position = newPos; return this;
  }
  setRot(newRot) {
    this.transform.rotation += newRot; return this;
  }
  changePos(pos) {
    this.transform.position += pos; return this;
  }
  changeRot(rot) {
    this.transform.rotation += rot; return this;
  }
  
  setColor(newColor){
    this.color = newColor;
  }
  
  _render(ctx){
    //Change the color
    ctx.fillStyle = this.color;
    //Save the last canvas state
    ctx.save();
    //Get the Center Point of this Sprite, and translate the position.
    let center = this.getCenter()
    ctx.translate(center.x, center.y)
    //Rotate the object, and add a rectangle using the offset values
    ctx.rotate( degToRad(this.transform.rotation) );
    let offset = this.getOffset();
    fillRectVec(ctx, offset, this.transform.scale);
    
    //Restore the previous canvas state, while keeping the sprite intact.
    ctx.restore();
    
  }
  
  getCenter(){
    let x = this.transform.position.x + this.transform.scale.x / 2
    let y = this.transform.position.y + this.transform.scale.y / 2
    return new Vec2(x, y)
  }
  getOffset(){
    let x = -this.transform.scale.x / 2 
    let y = -this.transform.scale.y / 2
    return new Vec2(x, y);
  }
}


//Fill Rect using Vector2
function fillRectVec(ctx,vPos,vScl){
  ctx.fillRect(vPos.x, vPos.y, vScl.x, vScl.y);
}

function degToRad(deg){
  return deg * Math.PI / 180
}


export function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}



export const SHAPE = {
  RECT: 0
}
export const FLAGS = {
  DEFAULT: 0,
  FILL_SCREEN: 1,
  KEEP_WIDTH: 2,
  KEEP_HEIGHT: 3,
  CUT_OFF: 4
}

export const VEC2 = {
  ZERO: new Vec2(0,0),
}
